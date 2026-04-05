module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.addColumn('Member', 'appleSub', {
      type: Sequelize.STRING
    })
  ]
};
