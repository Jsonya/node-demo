let cp = require('child_process');
let child = cp.fork('./child');
child.on('message',function(msg){
  console.log('msg from child:',msg);
});
child.send('hello world');
setTimeout(() => {
  child.disconnect();
}, 10000)