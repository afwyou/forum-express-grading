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

      // console.log(`列印出result：${result.rows}`)
      // console.log(`列印出data2==========${data2}`)
      //不知道該如何列印出result詳細物件內容

      // clean up restaurant data
      const data = result.rows.map(r => ({
        //result.count - 資料量
        //result.rows - 獲得餐廳資料陣列（有很多餐廳物件）
        //參考U140
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id)
        //req.user.FavoritedRestaurants 取出使用者的收藏清單，然後 map 成 id 清單，之後用 Array 的 includes 方法進行比對，最後會回傳布林值。
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
        { model: User, as: 'FavoritedUsers' },//調出有收藏此餐廳的關聯user
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      //把有收藏此餐廳的user經過map變成id清單後，比對是否符合使用者的id，如果有，表示是已經收藏的餐廳
      res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited: isFavorited
      })
      return restaurant.increment('viewCounts', { by: 1 })
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
        include: [User, Restaurant]//這樣就拿到了一包User跟一包Restaurant物件，而之前是透過restaurant.findall去抓取comment再透過comment抓取User，因此include裡面的語法就不一樣
        //{ model: Comment, include: [User] }
      })
    ]).then(([restaurants, comments]) => {
      // console.log(comments)
      return res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    })
  },
  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },//調出有收藏此餐廳的關聯user
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      return res.render('dashboard', { restaurant: restaurant.toJSON() })
    })
  }
}
module.exports = restController