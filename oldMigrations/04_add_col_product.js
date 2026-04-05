module.exports = {
    up: async (queryInterface, Sequelize) => [
      await queryInterface.addColumn('Product', 'additionalDescription', {
        type: Sequelize.STRING
      })
    ]
  };
  