const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const pageLimit = 10
const Comment = db.Comment
const User = db.User



const restController = {

  //瀏覽全部餐廳
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit//Restaurant.findAndCountAll
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }

    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      // data for pagination
      const page = Number(req.query.page) || 1//for prev next
      const pages = Math.ceil(result.count / pageLimit)//for totalPage
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name
      }))

      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },

  //瀏覽餐廳
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      // console.log('=====restaurant.Comments[0].dataValues=====')
      // console.log(restaurant.Comments[0].dataValues)
      // console.log('=====restaurant.Comments[0]=====')
      // console.log(restaurant.Comments[0])
      // console.log('=====restaurant.Comments=====')
      // console.log(restaurant.Comments)
      // console.log('=====restaurant=====')
      // console.log(restaurant)
      return res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
  },
  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    })
  },
}
module.exports = restController