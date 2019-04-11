process.on('message', function(msg){
  console.log('msg from parent:', msg)
});
let counter = 0;
setInterval(() => {
  process.send({ counter: counter++ });
}, 1000);
