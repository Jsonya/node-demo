/**
 * command：要运行的命令；
 * args：类型为数组，数组内第一项为文件名，后面项依次为执行文件的命令参数和值
 * options：选项，类型为对象，用于指定子进程的当前工作目录和主进程、子进程的通信规则等，
 * http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options
 */

const { spawn } = require('../checkChildProcess');
const path = require('path');
// 创建子进程
const child = spawn('node', ['process.js', '--port', '5000'], {
  stdio: [ 0, 1, 2 ]
});

// 出现错误触发
child.on('error', err => console.log(err));

// 子进程退出触发
child.on('exit', () => console.log('exit'));

// 子进程关闭触发
child.on('close', () => console.log('close'));

// exit
// close