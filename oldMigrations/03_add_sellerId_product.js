module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.addColumn('Product', 'sellerId', {
      type: Sequelize.STRING
    })
  ]
};
