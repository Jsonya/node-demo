// 引入 Express
const express = require('./core/application');
const path = require('path');

// 创建服务
const app = express();

// 1、指定模板引擎，其实就是模板文件的后缀名
// app.set('view engine', 'ejs');

// 2、指定模板的存放根目录
// app.set('views', path.resolve(__dirname, 'views'));

// 3、如果要自定义模板后缀和函数的关系
// app.engine('.html', require('./ejs').__express);

// 使用处理静态文件中间件
app.use(express.static(path.resolve(__dirname, 'public')));

// 创建路由
app.get('/user', function(req, res, next) {
  res.end('user');
});

app.get('/detail', function(req, res, next) {
  // 访问 /detail 重定向到 /user
  res.redirect('/user');
});

// 监听服务
app.listen(5000);