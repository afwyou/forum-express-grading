const db = require('../models')
const Category = db.Category


let categoryController = {
  //查詢分類
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/categories', { categories: categories })
    })
  },

  //新增分類
  postCategory: (req, res) => {
    if (!req.body.name) {
      //因為 didn't 單引號會影響JavaScript字串解析，因此加上跳脫字元 (escape character) \
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          res.redirect('/admin/categories')
        })
    }
  },
}
module.exports = categoryController