module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.changeColumn('Banner', 'categoryId', {
      type: Sequelize.STRING,
      allowNull: true
    }),
    await queryInterface.addColumn('Banner', 'productId', {
      type: Sequelize.STRING,
      allowNull: true
    })
  ]
};
