module.exports = {
    up: async (queryInterface, Sequelize) => [
      await queryInterface.addColumn('Cart', 'categoryId', {
        type: Sequelize.STRING
      }),
      await queryInterface.addColumn('Order', 'couponId', {
        type: Sequelize.STRING
      }),
      await queryInterface.addColumn('Order', 'amount', {
        type: Sequelize.FLOAT
      })
    ]
  };
  