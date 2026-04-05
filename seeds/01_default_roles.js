module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.bulkInsert('Roles', [
      {
        name: 'Seller',
        id: 'seller',
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'Seller who sell the various product'
      },
      {
        name: 'Buyer',
        id: 'buyer',
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'Buyer who buy the various product'
      },
      {
        name: 'admin',
        id: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'Admin Role'
      }
    ])
  ]
};
