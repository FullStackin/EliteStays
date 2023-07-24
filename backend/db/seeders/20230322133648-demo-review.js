"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
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
    // Seed data for Reviews
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 1,
          review: "Beautiful home with stunning ocean views!",
          stars: 5,
        },
        {
          spotId: 1,
          userId: 2,
          review: "Great location, close to the beach!",
          stars: 4,
        },
        {
          spotId: 1,
          userId: 3,
          review: "Spacious and comfortable",
          stars: 5,
        },
        {
          spotId: 2,
          userId: 1,
          review:
            "The coastal retreat exceeded all expectations. Highly recommended!",
          stars: 5,
        },
        {
          spotId: 3,
          userId: 3,
          review: "Absolutely stunning property, the beach access was a dream!",
          stars: 5,
        },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Reviews";
    return queryInterface.bulkDelete(options);
  },
};
