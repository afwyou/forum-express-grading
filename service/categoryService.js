const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {//屬於編輯類別畫面
        Category.findByPk(req.params.id)
          .then((category) => {
            return callback({
              categories: categories,
              category: category.toJSON()
            })
          })
      } else {//屬於全部類別畫面
        return callback({ categories: categories })
      }
    })
  },
}

module.exports = categoryService 