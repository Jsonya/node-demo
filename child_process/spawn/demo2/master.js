const { spawn } = require('../checkChildProcess');
const path = require('path');


// 创建子进程
const child = spawn('node', ['process.js', '--port', '5000'], {
  // stdin: [process.stdin, process.stdout, process.stderr]
  stdio: [0, 1, 2] // 配置标准输入、标准输出、错误输出
});
// 出现错误触发
child.on('error', err => console.log(err));

// 子进程退出触发
child.on('exit', () => console.log('exit'));

// 子进程关闭触发
child.on('close', () => console.log('close'));