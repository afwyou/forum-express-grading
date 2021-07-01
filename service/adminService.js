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
}

module.exports = adminService 