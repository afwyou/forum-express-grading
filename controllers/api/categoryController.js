const db = require('../../models')
const Category = db.Category
const categoryService = require('../../service/categoryService')


let categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },

  putCategories: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      return res.json(data)
    })
  },

  postCategory: (req, res) => {
    //沒有畫面問題，只需要把資訊回傳
    categoryService.postCategory(req, res, (data) => {
      return res.json(data)
    })
  },
}
module.exports = categoryController