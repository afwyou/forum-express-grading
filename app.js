const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const db = require('./models') // 引入資料庫
const app = express()
const port = 3000

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//要放在最後一行,這樣前面的樣板設定才能夠傳入路由
require('./routes')(app)

module.exports = app
