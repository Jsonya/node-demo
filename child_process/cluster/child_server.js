const http = require('http');

// 接收来自主进程发来的服务
process.on('message', (data, server) => {
  http.createServer((req, res) => {
    res.end(`child${process.pid}`);
  }).listen(server); // 子进程共用主进程的服务
});