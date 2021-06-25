const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true//可以 callback 的第一個參數裡拿到 req，這麼一來我們就可以呼叫 req.flash()
  },
  // authenticate user
  (req, username, password, cb) => {
    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    })
  }
))

// serialize and deserialize user
//「序列化」只存 user id，不存整個 user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
//「反序列化」就是透過 user id，把整個 user 物件實例拿出來
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' }
      // as 標明想要引入的關係，對應在 model 設定的別名。
    ]
  }).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport