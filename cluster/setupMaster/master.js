const cluster = require('cluster');
const path = require('path');
const os = require('os');

// 设置子进程读取文件的路径
cluster.setupMaster({
  exec: path.join(__dirname, 'child.js')
});

// 创建子进程
os.cpus().forEach(() => cluster.fork());
