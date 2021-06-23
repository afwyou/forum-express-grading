const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category



const restController = {

  //瀏覽全部餐廳
  getRestaurants: (req, res) => {
    const whereQuery = {}//要傳給 findAll 的參數，需要包裝成物件格式。
    let categoryId = ''
    if (req.query.categoryId) {//如果有的話
      categoryId = Number(req.query.categoryId)//傳給 Sequelize 時需要轉成數字格式
      whereQuery.CategoryId = categoryId
    }

    Restaurant.findAll({ include: Category, where: whereQuery }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name
      }))
      //上面透過關聯取得的category物件資料會夾帶在restaurant的物件裡面
      //但是上面已經取得的catagory物件並無法用restaurants.Category的方式列印出來？？？？
      //下面的category資料則是另外再呼叫的
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId
        })
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