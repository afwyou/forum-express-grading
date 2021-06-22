const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const fs = require('fs')

const adminController = {
  //瀏覽餐廳
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,//轉換成 JS 原生物件
      include: [Category]
      //預設情形下，Sequelize 只會返回屬於餐廳本身的資料，不包關聯的資料，設定 include 後，restaurants 會多一包物件，意味著你能夠用 this.Category 再取出這包物件。
      //文件上方用 db.Category 拿到了 Category model，所以直接把 Category 拿進來
    }).then(restaurants => {
      // console.log(restaurants)
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  },
  //瀏覽餐廳（一間）
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    }).then(restaurant => {
      console.log(restaurant)
      return res.render('admin/restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
  },
  //新增餐廳（進入新增頁面）
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  //編輯餐廳（進入頁面）
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/create', { restaurant: restaurant })
    })
  },
  //編輯餐廳（提交）
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image
            }).then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image
          })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
        })
    }
  },
  //新增餐廳（提交）
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null//如果沒有上傳圖片，就沒有
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    }
  },
  //刪除
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  },
  //顯示使用者清單
  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then(users => {
      return res.render('admin/users', { users: users })
    })
  },
  //切換使用者權限
  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        user.isAdmin = user.isAdmin ? false : true
        //有沒有其他方法可以改變？
        req.flash('success_messages', 'user was successfully to update')
        return user.save()
      })
      .then(() => {
        return res.redirect('/admin/users')
      })
  },

}

module.exports = adminController