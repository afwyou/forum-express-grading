const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const adminService = require('../../service/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
      //函式參數
      //我要在controller放入這個函式，這個函式的參數又會在controller放入真正的data
      //這裡沒有我要的data(要透過model呼叫)
    })
  },
}
module.exports = adminController