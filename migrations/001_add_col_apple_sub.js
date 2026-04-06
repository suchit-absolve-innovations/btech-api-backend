module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('Member');
    if (tableDefinition.appleSub) return;

    await queryInterface.addColumn('Member', 'appleSub', {
      type: Sequelize.STRING
    });
  }
};
