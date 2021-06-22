const db = require('../models')
const Category = db.Category


let categoryController = {
  //查詢分類
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      //如果從edit發送請求，就會帶有id
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            return res.render('admin/categories', {
              categories: categories,//渲染所有category
              category: category.toJSON()//渲染輸入匡的category
            })
          })
      } else {
        return res.render('admin/categories', { categories: categories })
      }
    })
  },
  //修改分類
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              res.redirect('/admin/categories')
            })
        })
    }
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