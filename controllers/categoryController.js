const db = require('../models')
const Category = db.Category


let categoryController = {
  //查詢分類
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },
  //修改分類
  putCategory: (req, res) => {
    categoryService.putCategories(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
  },

  //新增分類
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      //因為要給前端顯示不同的頁面，因此需要if else
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
  },

  //刪除分類
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/categories')
      }
    })
  }
}
module.exports = categoryController