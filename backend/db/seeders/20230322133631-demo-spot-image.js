'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'img1',
        preview: true
      },
      {
        spotId: 1,
        url: 'img1',
        preview: true
      },
      {
        spotId: 2,
        url: 'img2',
        preview: true
      },
      {
        spotId: 2,
        url: 'img2',
        preview: true
      },   {
        spotId: 3,
        url: 'img3',
        preview: true
      },
      {
        spotId: 3,
        url: 'img3',
        preview: true
      },   {
        spotId: 4,
        url: 'img4',
        preview: true
      },
      {
        spotId: 4,
        url: 'img4',
        preview: true
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options);
  }
};
