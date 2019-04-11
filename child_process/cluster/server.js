const os = require('os'); // os 模块用于获取系统信息
const http = require('http');
const path = require('path');
const { fork } = require('child_process');

// 创建服务
const server = http.createServer((res, req) => {
  res.end('parent hello');
}).listen(5000);

// 根据 CPU 个数创建子进程
os.cpus().forEach(() => {
  console.log(server)
  fork('child_server.js', {
    cwd: path.join(__dirname)
  }).send('server', server);
});