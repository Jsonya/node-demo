/**
  PS: 极度不安全
  子进程执行的是非node程序，传入一串shell命令，执行后结果以回调的形式返回，与execFile
  不同的是exec可以直接执行一串shell命令
 */
const cp = require('child_process');
cp.exec('echo hello wolrd', (err, str) => {
  console.log(str)
});