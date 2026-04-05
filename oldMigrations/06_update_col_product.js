module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.changeColumn('Product', 'additionalDescription', {
        type: Sequelize.TEXT('long')
      });
    } catch (error) {
      // do nothing
    }
  }
};
