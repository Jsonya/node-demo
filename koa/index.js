const fs = require('fs');

const Koa = require('./core/application');
const app = new Koa();

app.use(async (ctx, next) => {
  ctx.body = 'hello';
  throw new Error('error');
});

// app.use(async (ctx, next) => {
//   ctx.body = 'xx';

//   ctx.body = await new Promise((resolve, reject) => {
//     setTimeout(() => resolve('panda'), 20000);
//   });
// });

app.on('error', msg => {
  console.log(msg)
})

app.listen(5000, () => {
  console.log('http start')
})