'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //注意外鍵首字大寫！
    await queryInterface.addColumn('Restaurants', 'CategoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      //設定必填，也就是每一筆餐廳資料都要指定 CategoryId，否則無法寫入資料庫
      references: {
        //明確指定在這筆 migration 生效時，需要一併把關聯設定起來。
        model: 'Categories',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'CategoryId')
  }
};
