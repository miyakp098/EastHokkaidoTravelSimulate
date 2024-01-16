var map;
var directionsService;
var directionsDisplay;
var customMarkers = [];
var waypoints = [];

var start, end;

var locationDetails = {
  'ラムサール条約湿地～濤沸湖～': {
    info: '濤沸湖は、アイヌ語で「トプッ」と呼ばれ、湖の口を意味しています。川の水と海水が入り混じる湖は、海からの栄養が加わることで生物にとって豊かな環境となっています。',
    stayTime: 15
  },
  '天に続く道展望台': {
    info: '道東・斜里町の峰浜から大栄地区まで続く約18キロの直線ルート（国道334号・244号線／斜里国道）。道の先が“天”につながっているように見えることから、この愛称が付けられました。',
    stayTime: 10
  },
  '美幌峠': {
    info: '美幌峠は「天下の絶景」と謳われており、毎年多くの観光客で賑わいます。',
    stayTime: 20
  },
  '摩周湖第一展望台': {
    info: '摩周湖は、北海道川上郡弟子屈町にある湖。日本でもっとも、世界ではバイカル湖についで2番目に透明度の高い湖である。2001年には北海道遺産に選定された。',
    stayTime: 15
  },
  '網走': {
    info: '網走市は、北海道の北東沿岸に位置し、オホーツク海の流氷で知られています。',
    stayTime: 0
  },
  '知床第一ホテル': {
    info: '知床半島は、北海道東部の斜里郡斜里町と目梨郡羅臼町にまたがる、オホーツク海の南端に突出した半島。宿泊施設は知床第一ホテルなどがある。',
    stayTime: 20
  },
  '神の子池': {
    info: '摩周湖からの地下水が湧き出ている山の奥にある池で、摩周湖（カムイトー＝神の湖）の伏流水からできているという言い伝えから「神の子」池と呼ばれています。',
    stayTime: 20
  },
  'オンネトー': {
    info: 'オンネトーは、北海道足寄郡足寄町東部の阿寒摩周国立公園内にある湖である。',
    stayTime: 20
  },
  'オシンコシンの滝': {
    info: 'オシンコシンの滝は、北海道斜里郡斜里町のチャラッセナイ川の河口付近にある滝。',
    stayTime: 10
  },
  '女満別空港': {
    info: '女満別空港は、北海道網走郡大空町にある地方管理空港である。',
    stayTime: 20
  },
  'メルヘンの丘': {
    info: '7本のカラマツが並ぶ絵本のようなこの風景。女満別空港から車で10分のところに位置し、「メルヘンの丘」と呼ばれています。',
    stayTime: 10
  },
  '小清水原生花園': {
    info: '小清水原生花園とは、北海道斜里郡小清水町にある砂丘上の草原地帯に広がる原生花園である。',
    stayTime: 10
  },
  'ニュー阿寒ホテル': {
    info: '阿寒には天然記念物「マリモ」、「阿寒湖」などが魅力であり、宿泊施設はニュー阿寒ホテルなどがある。',
    stayTime: 0
  },
  '網走監獄': {
    info: '「北海道開拓と監獄受刑者」をテーマとした景勝天都山麓に位置する野外歴史博物館。オホーツクの四季を通し様々なイベントを行っている。',
    stayTime: 40
  },
  'オホーツク流氷館': {
    info: 'オホーツク流氷館は北海道網走市の天都山山頂にある流氷とオホーツク海をテーマとする網走市立の科学館。',
    stayTime: 30
  },
  '北海道立北方民族博物館': {
    info: '北方地域の諸民族の文化：イヌイットやスオミなどの北方の諸民族を対象とし、衣・食・住・生業・精神文化・文化の伝承などのテーマ別に展示。',
    stayTime: 30
  },
};

//地点の名前

  const p1 = '網走'
  const p2 = '阿寒'//ニュー阿寒ホテル
  const p3 = '知床'//知床第一ホテル

  const airport1 = '女満別空港'
  //const airport2 = '紋別空港'
  // const p5 = '根室'
  // const p6 = '釧路'
  // const p7 = '帯広'

  
document.addEventListener('DOMContentLoaded', function() {
    // 地点の名前
    const points = [p1, p2, p3, airport1];

    // ボタンを追加するためのdiv要素を取得
    const startButtonsDiv = document.getElementById('start-buttons');
    const endButtonsDiv = document.getElementById('end-buttons');

    // ボタン生成と追加の関数
    function addButtonsToDiv(div, buttonIdPrefix, onClickFunction) {
        points.forEach(function(point) {
            // 新しいボタン要素を作成
            const button = document.createElement('button');
            button.id = buttonIdPrefix + '-' + point;
            button.textContent = point;

            // onclickイベントハンドラを設定
            button.onclick = function() {
                onClickFunction(point);
            };

            // ボタンをdivに追加
            div.appendChild(button);
        });
    }

    // Start地点のボタンを追加
    addButtonsToDiv(startButtonsDiv, 'start', setStart);

    // End地点のボタンを追加
    addButtonsToDiv(endButtonsDiv, 'end', setEnd);
});

//観光地の名前

  const aba1 = '網走監獄'
  const aba2 = 'オホーツク流氷館';
  const aba3 = '北海道立北方民族博物館';
  

  const s1 = 'ラムサール条約湿地～濤沸湖～'
  const s2 = '天に続く道展望台'
  const s3 = '美幌峠'
  const s4 = '摩周湖第一展望台'
  const s5 = '神の子池'
  const s6 = '小清水原生花園'
  const s7 = ''
  const s8 = 'オンネトー'
  const s9 = 'オシンコシンの滝'
  const s10 = 'メルヘンの丘';



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


function calculateWaypoints(start, end) {
  let baseRoutes = {};

  
  if ((start === airport1 || start === '知床第一ホテル') && (end === airport1 || end === '知床第一ホテル') && start !== end) {
    //女満別空港ー知床ルート
    baseRoutes[airport1 + '_' + '知床第一ホテル'] = [
      [{location: s1, stopover: true},{location: s2, stopover: true},{location: s9, stopover: true}],
      [{location: aba1, stopover: true}, {location: aba2, stopover: true},{location: aba3, stopover: true},
        {location: s1, stopover: true},{location: s2, stopover: true},{location: s9, stopover: true}]
    ];
  }else if((start === airport1 || start === 'ニュー阿寒ホテル') && (end === airport1 || end === 'ニュー阿寒ホテル') && start !== end){
    //女満別空港ー阿寒
    baseRoutes[airport1 + '_' + 'ニュー阿寒ホテル'] = [
      [{location: s3, stopover: true}],
      [{location: s3, stopover: true}, {location: s5, stopover: true},{location: s4, stopover: true}],
      [{location: aba1, stopover: true}, {location: aba2, stopover: true},{location: aba3, stopover: true},
        {location: s5, stopover: true},{location: s4, stopover: true},],
    ];
  }else if((start === airport1 || start === p1) && (end === airport1 || end === p1) && start !== end){
    //女満別空港ー網走
    baseRoutes[airport1 + '_' + p1] = [
      [{location: s10, stopover: true}]
    ];
  }else if ((start === p1 || start === '知床第一ホテル') && (end === p1 || end === '知床第一ホテル') && start !== end) {
    //網走ー知床ルート
    baseRoutes[p1 + '_' + '知床第一ホテル'] = [
      [{location: s1, stopover: true},{location: s2, stopover: true},{location: s9, stopover: true}],
      [{location: aba1, stopover: true}, {location: aba2, stopover: true},{location: aba3, stopover: true},
        {location: s1, stopover: true},{location: s2, stopover: true},{location: s9, stopover: true}]
    ];
  }else if((start === p1 || start === 'ニュー阿寒ホテル') && (end === p1 || end === 'ニュー阿寒ホテル') && start !== end){
    //網走ー阿寒
    baseRoutes[p1 + '_' + 'ニュー阿寒ホテル'] = [
      [{location: s10, stopover: true},{location: s3, stopover: true}],
      [{location: s3, stopover: true}, {location: s4, stopover: true}],
      [{location: aba1, stopover: true}, {location: aba2, stopover: true},{location: aba3, stopover: true},
        {location: s5, stopover: true},{location: s4, stopover: true},],
    ];
  }else if((start === 'ニュー阿寒ホテル' || start === '知床第一ホテル') && (end === 'ニュー阿寒ホテル' || end === '知床第一ホテル') && start !== end){
    //阿寒ー知床
    baseRoutes['ニュー阿寒ホテル' + '_' + '知床第一ホテル'] = [
      [{location: s4, stopover: true},{location: s2, stopover: true},{location: s9, stopover: true},],
      [{location: s3, stopover: true}, {location: s10, stopover: true},{location: aba1, stopover: true}, 
        {location: aba2, stopover: true},{location: aba3, stopover: true},
        {location: s2, stopover: true},{location: s9, stopover: true}],
        [{location: s3, stopover: true}, {location: s10, stopover: true},
          {location: s2, stopover: true},{location: s9, stopover: true}]
    ];
  }else if(start === end){
    alert('出発地と目的地は違う場所を選んでください');
  }

  waypoints = []; // 関数が呼ばれるたびにwaypointsをリセット
  let routeKey = start + '_' + end;

  if (baseRoutes[routeKey]) {
    waypoints = baseRoutes[routeKey];
  } else {
    routeKey = end + '_' + start;
    if (baseRoutes[routeKey]) {
      // 各ルートを逆順にしてwaypointsに格納
      baseRoutes[routeKey].forEach(route => {
        waypoints.push(route.slice().reverse());
      });
    }
  }
}




//スタート地点とゴール地点の格納
function setStart(location) {
  if(location === '知床'){
    start = '知床第一ホテル';
  }else if(location === '阿寒'){
    start = 'ニュー阿寒ホテル';
  }else{
    start = location;
  }
  
  updateButtonStyles('start-buttons', 'start-' + location);
}

function setEnd(location) {
  if(location === '知床'){
    end = '知床第一ホテル';
  }else if(location === '阿寒'){
    end = 'ニュー阿寒ホテル';
  }else{
    end = location;
  }
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

  calculateWaypoints(start, end)

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
      routeHtml += '<button class="accordion" onclick="onLocationClicked(\'start-panel\')">出発地点 1: ' + start + '</button>';
      routeHtml += '<div id="start-panel" class="panel" style="display: none;"><p class="accordion-info-start_end">' + startDetails + '</p></div><br>';

      for (var i = 0; i < routeDetails.length; i++) {
        var detail = routeDetails[i];
        var panelId = 'waypoint-panel-' + i;
        var locationName = detail.endPoint;
        var imageSrc = './images/' + locationName + '.jpg';
        var locationInfo = locationDetails[locationName].info || '詳細情報が利用できません';
        var locationStayTime = locationDetails[locationName].stayTime || '詳細情報が利用できません'

        routeHtml += '　↓移動時間' + ': ' + detail.duration + '分<br>';

        

        if (i < routeDetails.length - 1) {
          routeHtml += '<button class="accordion" onclick="onLocationClicked(\'' + panelId + '\')">中間地点 ' + (i + 2) + ': ' + locationName + ' 　滞在時間: ' + locationStayTime + '分</button>';
          routeHtml += '<div id="' + panelId + '" class="panel" style="display: none;"><img src="' + imageSrc + '" alt="' + locationName + '" class="accordion-image"><p class="accordion-info">' + locationInfo + '</p></div><br>';


          totalDuration += locationDetails[locationName].stayTime*60;
        }
      }

      // 目的地の詳細情報
      var endDetails = locationDetails[end].info || '詳細情報が利用できません';
      routeHtml += '<button class="accordion" onclick="onLocationClicked(\'end-panel\')">目的地 ' + + (i + 1) + ': ' + end + '</button>';
      routeHtml += '<div id="end-panel" class="panel" style="display: none;"><p class="accordion-info-start_end">' + endDetails + '</p></div>';

     

      document.getElementById('points').innerHTML = routeHtml;
      var hours = Math.floor(totalDuration / (60*60));
      var minutes = Math.floor(totalDuration / 60) % 60;
      //var totalDurationText = Math.floor(totalDuration / 60) + '分'+ hours+'+'+ minutes;確認用
      var totalDurationText = hours + '時間' + minutes + '分';

      document.getElementById('duration').innerHTML = '　総所要時間: ' + totalDurationText;
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
