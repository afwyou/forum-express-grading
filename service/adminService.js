const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ include: [Category] }).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    }).then(restaurant => {
      //在這裡要執行這個callback，當整個函式被呼叫時，這個callback就會被放入正確的
      callback({ restaurant: restaurant.toJSON() })
    })
  },

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            callback({ status: 'success', message: '' })
          })
        //JSON 裡有兩個屬性
        //status：表達成功/失敗，也可能使用 HTTP 狀態碼
        //message：補充說明更多細節。
      })
  }
}

module.exports = adminService 