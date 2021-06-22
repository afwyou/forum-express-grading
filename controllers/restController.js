const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category



const restController = {
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
  }
}
module.exports = restController