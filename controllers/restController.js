const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category



const restController = {

  //瀏覽全部餐廳
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: Category }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r.dataValues,//展開運算子 
        description: r.dataValues.description.substring(0, 50),//截斷文字
        categoryName: r.Category.name//直接給定 categoryName 屬性，把類別名稱放進來
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  },
  //瀏覽餐廳
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category
    }).then(restaurant => {
      return res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
  }
}
module.exports = restController