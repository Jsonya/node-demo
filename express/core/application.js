const http = require('http');

// methods 模块返回存储所有请求方法名称的数组
const methods = http.METHODS;
const querystring = require('querystring');
const util = require('util');
const httpServer = require('_http_server'); // 存储 node 服务相关信息
const fs = require('fs');
const path = require('path');
// 响应类型
// const mime = require('mime');

function createApplication() {
  // 创建 app 函数，身份为总管家，用于将请求分派给别人处理
  const app = function(req, res) {
    // 循环匹配路径
    let index = 0;

    function next(err) {
      // 获取第一个回调函数
      const layer = app.routes[index++];
      console.log(layer)

      if (layer) {
        // 将当前中间件函数的属性解构出来
        let { method, pathname, handler } = layer;

        if (err) { // 如果存在错误将错误交给错误处理中间件，否则
          if (method === 'middle', handle.length === 4) {
            return hanlder(err, req, res, next);
          } else {
            next(err);
          }
        } else { // 如果不存在错误则继续向下执行
          // 判断是中间件还是路由
          if (method === 'middle') {
            // 匹配路径判断
            if (
              pathname === '/' ||
              pathname === req.path ||
              req.path.startWidth(pathname)
            ) {
              handler(req, res, next);
            } else {
              next();
            }
          } else {
            // 如果路由对象上存在正则说明存在路由参数，否则正常匹配路径和请求类型
            if (layer.regexp) {
              // 使用路径配置的正则匹配请求路径
              const result = req.path.match(layer.regexp);

              // 如果匹配到结果且请求方式匹配
              if (
                result &&
                (
                  method === layer.method ||
                  layer.method === 'all'
                )
              ) {
                // 则将路由对象 paramNames 属性中的键与匹配到的值构建成一个对象
                req.params = layer.paramNames.reduce(
                  function(memo, key, index ) {
                    memo[key] = result[index + 1];
                    return memo;
                  },
                  {}
                );

                // 执行对应的回调
                return layer.hanlder(req, res);
              } else {
                next();
              }
            } else {
              // 如果说路径和请求类型都能匹配，则执行该路由层的回调
              if (
                (req.path === layer.pathname || layer.pathname === '*') &&
                (method === layer.method || layer.method === 'all')
              ) {
                return layer.handler(req, res);
              } else {
                next();
              }
            }
          }
        }
      } else {
        // 如果都没有匹配上，则响应错误信息
        res.end(`CANNOT ${req.method} ${req.path}`);
      }
    }

    next();
  }

  function init() {
    return function(req, res, next) {
      // 获取方法名统一转换成小写
      const method = req.method.toLowerCase();

      // 访问路径解构成路由和查询字符串两部分 /user?a=1&b=2
      let [reqPath, query = ''] = req.url.split('?');

      // 将路径名赋值给 req.path
      req.path = reqPath;
      // 将查询字符串转换成对象赋值给 req.query
      req.query = querystring.parse(query);
      // 将主机名赋值给 req.host
      req.host = req.headers.host.split(':')[0];

      // 响应方法
      res.send = function(params) {
        // 设置响应头
        res.setHeader('Content-Type', 'text/plain;charset=utf8');

        // 检测传入值得数据类型
        switch (typeof params) {
          case 'object':
            res.setHeader('Content-Type', 'application/json;charset=utf8');

            // 将任意类型的对象转换成字符串
            params = util.inspect(params);
            break;
          case 'number':
            // 数字则直接取出状态吗对应的名字返回
            params = httpServer.STATUS_CODES[params];
            break;
          default:
            break;
        }

        // 响应
        res.end(params);
      }

      // 响应文件方法
      res.sendFile = function(pathname) {
        fs.createReadStream(pathname).pipe(res);
      }

      // 模板渲染方法
      res.render = function(filename, data) {
        // 将文件名和模板路径拼接
        let filepath = path.join(app.get('views'), filename);

        // 获取扩展名
        let extname = path.extname(filename.split(path.sep).pop());

        // 如果没有扩展名，则使用默认的扩展名
        if (!extname) {
          extname = `.${app.get('view engine')}`
          filepath += extname;
        }

        // 读取模板文件并使用渲染引擎相应给浏览器
        app.engines[extname](filepath, data, function(err, html) {
          res.setHeader('Content-Type', 'text/html;charset=utf8');
          res.end(html);
        });
      }

      // 重定向方法
      res.redirect = function(status, target) {
        // 如果第一个参数是字符串类型说明没有传状态码
        if (typeof status === 'string') {
          // 将第二个参数（重定向的目标路径）设置给 target
          target = status;

          // 再把状态码设置成 302
          status = 302;
        }

        // 响应状态码，设置重定向响应头
        res.statusCode = status;
        res.setHeader('Location', target);
        res.end();
      }

      // 向下执行
      next();
    }
  }

  // 存储路由层的请求类型、路径和回调
  app.routes = [];

    // 返回一个函数体用于将路由层存入 app.routes 中
  function createRouteMethod(method) {
    return function(pathname, handler) {
      // 满足条件说明是取值方法
      if (method === 'get' && arguments.length === 1) {
        return app.settings[pathname];
      }
      const layer = {
        method,
        pathname, // 不包含查询字符串
        handler
      };

      // 如果含有路由参数，如 /xxx/:aa/:bb
      // 取出路由参数的键 aa bb 存入数组并挂在路由对象上
      // 并生匹配 /xxx/aa/bb 的正则挂在路由对象上
      if (
        pathname.indexOf(':') !== -1 &&
        pathname.method !== 'middle'
      ) {
        const paramNames = []; // 存储路由参数

        // 将路由参数取出存入数组，并返回正则字符串
        const regStr = pathname.replace(/:(\w+)/g, function(matched, attr) {
          paramNames.push(attr);
          return '(\\w+)';
        });

        let regexp = new RegExp(regStr); // 生成正则类型
        layer.regexp = regexp; // 将正则挂在路由对象上
        layer.paramNames = paramNames; // 将存储路由参数的数组挂载对象上
      }

      // 把这一层放入存储所有路由层信息的数组中
      app.routes.push(layer);
    }
  }

  // 循环构建所有路由方法，如 app.get app.post 等
  methods.forEach(function(method) {
    const newMethod = method.toLowerCase();
    // 匹配路由的 get 方法
    app[newMethod] = createRouteMethod(newMethod);
  });

  // all 方法，通吃所有请求类型
  app.all = createRouteMethod('all');

  // 添加中间件方法
  app.use = function(pathname, handler) {
    // 处理没有传入路径的情况
    if (typeof handler !== 'function') {
      handler = pathname;
      pathname = '/';
    }

    // 生成函数并执行
    createRouteMethod('middle')(pathname, handler);
  }

  // 将初始逻辑作为中间件执行
  app.use(init());

  // 存储设置的对象
  app.setting ={};

  // 存储模板渲染方法
  app.engines = {};

  // 添加设置的方法
  app.set = function(key, value) {
    app.use[key] = value;
  }

  // 添加渲染引擎的方法
  app.engine = function(ext, renderFile) {
    app.engines[ext] = renderFile;
  }

  // 启动服务的 listen 方法
  app.listen = function() {
    // 创建服务器
    const server = http.createServer(app);

    // 监听服务，可能传入多个参数，如第一个参数为端口号，最后一个参数为服务启动后回调
    server.listen(...arguments);
  }

  // 返回 app
  return app;
}

createApplication.static = function(staticRoot) {
  return function(req, res, next) {
    // 获取文件的完整路径
    let filename = path.join(staticRoot, req.path);

    // 如果没有权限就向下执行其他中间件，如果有权限读取文件并响应
    fs.access(filename, function(err) {
      if (err) {
        next();
      } else {
        // 设置响应头类型和响应文件内容
        // res.setHeader('Content-Type', `${mime.getType()};charset=utf8`);
        res.setHeader('Content-Type', `text/html;charset=utf8`);
        fs.createReadStream(filename).pipe(res);
      }
    });
  }
}

module.exports = createApplication;