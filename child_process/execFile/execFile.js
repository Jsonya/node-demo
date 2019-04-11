/**
  子进程中执行的是非node程序，提供一组参数后，执行的结果以回调的形式返回
  execFlie会在process.env.PATH的路径中依次寻找是否有名为'echo'的应用，找到后就会执行。
  默认的process.env.PATH路径中包含了'usr/local/bin',而这个'usr/local/bin'目录中就存在了这个名为'echo'的程序，
  传入hello和world两个参数，执行后返回
 */
const cp = require('child_process');
cp.execFile('echo', [ 'hello', 'world' ], (err, str) => {
  console.log(str)
});