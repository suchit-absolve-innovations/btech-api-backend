module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Order', 'paymentType', {
        type: Sequelize.ENUM('ONLINE', 'COD'),
        defaultValue: 'COD'
      });
    } catch (error) {
      // do nothing
    }
    try {
      await queryInterface.changeColumn('Order', 'status', {
        type: Sequelize.ENUM('ACCEPTED', 'DELIVERED', 'SHIPPED', 'PENDING', 'CANCELLED', 'RETURN', 'INCOMPLETE')
      });
    } catch (error) {
      // do nothing
    }
  }
};
