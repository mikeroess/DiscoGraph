'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Genres', [{
      title: 'rock',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      title: 'pop',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      title: 'jazz',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      title: 'classical',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      title: 'electronic',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      title: 'funk-soul',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      title: 'hip-hop',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
