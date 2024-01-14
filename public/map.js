var map;
var directionsService;
var directionsDisplay;
var customMarkers = [];

var start, end;

var locationDetails = {
  'ラムサール条約湿地～濤沸湖～': {
    info: 'ここはラムサール条約湿地～濤沸湖～の詳細情報です。',
    stayTime: 20
  },
  '天に続く道展望台': {
    info: '天に続く道展望台についての情報がここに表示されます。',
    stayTime: 20
  },
  '小清水': {
    info: '小清水の魅力的な情報をここに紹介します。',
    stayTime: 40
  },
  '清里町': {
    info: '清里町に関する興味深い詳細がここにあります。',
    stayTime: 20
  },
  '美幌峠': {
    info: '美幌峠の素晴らしい景観についての説明をここで読むことができます。',
    stayTime: 30
  },
  '摩周湖第一展望台': {
    info: '摩周湖第一展望台からの眺めの素晴らしさについてここで説明します。',
    stayTime: 20
  },
  '網走': {
    info: '網走の歴史や文化に関する情報がここにあります。',
    stayTime: 20
  },
  '知床第一ホテル': {
    info: '知床第一ホテルの豪華さと快適さについての詳細がここに表示されます。',
    stayTime: 20
  }
};

function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
  var abashiri = new google.maps.LatLng(44.0206, 144.2735);
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: abashiri
  });
  directionsDisplay.setMap(map);
}

//スタート地点とゴール地点の格納
function setStart(location) {
  start = location;
  updateButtonStyles('start-buttons', 'start-' + location);
}

function setEnd(location) {
  end = location;
  updateButtonStyles('end-buttons', 'end-' + location);
}
//ボタン選択した時の色を変える
function updateButtonStyles(buttonGroupId, selectedButtonId) {
  var buttons = document.getElementById(buttonGroupId).getElementsByTagName('button');
  for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('selected');
  }
  document.getElementById(selectedButtonId).classList.add('selected');
}

function calculateAndDisplayRoute() {
  clearCustomMarkers();

  if (start === '網走' && end === '知床第一ホテル') {
    waypoints = [
        [{location: 'ラムサール条約湿地～濤沸湖～', stopover: true}, {location: '天に続く道展望台', stopover: true}],
        [{location: '小清水', stopover: true}, {location: '清里町', stopover: true}],
        [{location: '美幌', stopover: true}, {location: '小清水', stopover: true}, {location: '清里町', stopover: true}],
        [{location: '美幌峠', stopover: true}, {location: '摩周湖第一展望台', stopover: true}],
    ];
  } else if (start === '知床第一ホテル' && end === '網走') {
    waypoints = [
      [{location: '天に続く道展望台', stopover: true}, {location: 'ラムサール条約湿地～濤沸湖～', stopover: true}],
      [{location: '清里町', stopover: true}, {location: '小清水', stopover: true}],
      [{location: '清里町', stopover: true}, {location: '小清水', stopover: true}, {location: '美幌', stopover: true}],
      [{location: '摩周湖第一展望台', stopover: true}, {location: '美幌峠', stopover: true}],
      ];
  } else {
    //例外処理、startとendが設定されていない場合など
  }
  

  var randomIndex = Math.floor(Math.random() * waypoints.length);
  var waypoint = waypoints[randomIndex];


  directionsService.route({
    origin: start,
    destination: end,
    waypoints: waypoint,
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      addCustomMarker(response.routes[0].legs[0].start_location, "1");

      var routeDetails = [];
      var totalDuration = 0;

      var legs = response.routes[0].legs;
      for (var i = 0; i < legs.length; i++) {
        var legDuration = Math.floor(legs[i].duration.value / 60);
        
        totalDuration += legs[i].duration.value;

        routeDetails.push({
          segment: i + 1,
          startPoint: i === 0 ? start : waypoint[i - 1].location,
          endPoint: i < legs.length - 1 ? waypoint[i].location : end,
          duration: legDuration
        });

        if (i < legs.length - 1) {
          addCustomMarker(legs[i].end_location, (i + 2).toString());
        }
      }

      addCustomMarker(legs[legs.length - 1].end_location, (legs.length + 1).toString());

      var routeHtml = '';
      // 出発地点の詳細情報
      var startDetails = locationDetails[start].info || '詳細情報が利用できません';
      routeHtml += '<button class="accordion" onclick="onLocationClicked(\'start-panel\')">出発地点: ' + start + '</button>';
      routeHtml += '<div id="start-panel" class="panel" style="display: none;"><p>' + startDetails + '</p></div><br>';

      for (var i = 0; i < routeDetails.length; i++) {
        var detail = routeDetails[i];
        var panelId = 'waypoint-panel-' + i;
        var locationName = detail.endPoint;
        var imageSrc = './images/' + locationName + '.jpg';
        var locationInfo = locationDetails[locationName].info || '詳細情報が利用できません';
        var locationStayTime = locationDetails[locationName].stayTime || '詳細情報が利用できません'

        routeHtml += '　↓移動時間' + ': ' + detail.duration + '分<br>';

        

        if (i < routeDetails.length - 1) {
          routeHtml += '<button class="accordion" onclick="onLocationClicked(\'' + panelId + '\')">中間地点 ' + (i + 1) + ': ' + locationName + ' 　滞在時間: ' + locationStayTime + '分</button>';
          routeHtml += '<div id="' + panelId + '" class="panel" style="display: none;"><img src="' + imageSrc + '" alt="' + locationName + '"><p>' + locationInfo + '</p></div><br>';

          totalDuration += locationDetails[locationName].stayTime*60;
        }
      }

      // 目的地の詳細情報
      var endDetails = locationDetails[end].info || '詳細情報が利用できません';
      routeHtml += '<button class="accordion" onclick="onLocationClicked(\'end-panel\')">目的地: ' + end + '</button>';
      routeHtml += '<div id="end-panel" class="panel" style="display: none;"><p>' + endDetails + '</p></div>';

     

      document.getElementById('points').innerHTML = routeHtml;
      var totalDurationText = Math.floor(totalDuration / 60) + '分';
      document.getElementById('duration').innerHTML = '総所要時間: ' + totalDurationText;
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

//ボタンを押した時のアコーディオン開閉
function onLocationClicked(panelId) {
  var panel = document.getElementById(panelId);
  if (panel.style.display === 'block') {
    panel.style.display = 'none';
  } else {
    panel.style.display = 'block';
  }
}

function addCustomMarker(position, label) {
  var marker = new google.maps.Marker({
    position: position,
    map: map,
    label: {
      text: label,
      color: "white"
    }
  });
  customMarkers.push(marker);
}

function clearCustomMarkers() {
  for (var i = 0; i < customMarkers.length; i++) {
    customMarkers[i].setMap(null);
  }
  customMarkers = [];
}

google.maps.event.addDomListener(window, 'load', initMap);
