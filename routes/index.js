let routes = require('./routes');
let apis = require('./apis')

module.exports = (app) => {//passport原本在這裡當參數，是因為這裡原本有使用到passport的路由認證
  //app.js本身有passport的引用，又引用這裡輸出的module的route所關聯的關係
  app.use('/', routes);
  app.use('/api', apis)
}