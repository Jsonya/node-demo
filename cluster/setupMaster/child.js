const http = require('http');

// 创建并监听服务
http.createServer((req, res) => {
  res.end(`child${process.pid}`);
}).listen(5000);