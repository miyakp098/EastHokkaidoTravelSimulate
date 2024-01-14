const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// EJSビューエンジンを設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静的ファイルを提供するためのディレクトリを設定
app.use(express.static(path.join(__dirname, 'public')));

// ルートURLへのリクエストに対してindex.ejsを提供（Google Maps APIキーを含む）
app.get('/', (req, res) => {
  res.render('index', { apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

// サーバーを起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
