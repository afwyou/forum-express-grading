const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
//這個環境變數要記得也要存入heroku
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const fs = require('fs')
const adminService = require('../service/adminService')


const adminController = {
  //瀏覽餐廳
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  //瀏覽餐廳（一間）
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  //新增餐廳（進入新增頁面）
  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', {
        categories: categories
      })
    })
  },
  //編輯餐廳（進入頁面）
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories: categories,
          restaurant: restaurant.toJSON()
        })
      })
    })
  },
  //編輯餐廳（提交）
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  //新增餐廳（提交）
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  //刪除
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      //收到 success，就跳回後台的餐廳總表
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
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