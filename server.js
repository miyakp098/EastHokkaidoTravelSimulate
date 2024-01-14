const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;  // Render が使用するポート、またはローカルで3000ポートを使用

// 静的ファイルを提供するためのディレクトリを設定
app.use(express.static('public'));

// ルートURLへのリクエストに対してindex.htmlを提供
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// サーバーを起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
