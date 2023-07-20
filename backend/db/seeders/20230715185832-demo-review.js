"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(
      options,
      [
        {
          listingId: 1, //reviewId: 1
          userId: 2,
          review: "awesome fight gym!",
          stars: 5,
        },
        {
          listingId: 1, //reviewId: 2
          userId: 3,
          review: "Had a great stay here!",
          stars: 4,
        },
        {
          listingId: 2, //reviewId: 3
          userId: 3,
          review: "Clean place, pictures made it seem bigger.",
          stars: 4,
        },
        {
          listingId: 3, //reviewId: 4
          userId: 1,
          review: "So close to the beach!",
          stars: 5,
        },
        {
          listingId: 4, //reviewId: 5
          userId: 2,
          review: "Awesome Gym! Guys are ready for war",
          stars: 3,
        },
        {
          listingId: 4,  //reviewId: 6
          userId: 1,
          review: "had a great fight camp here! stand up go crazy",
          stars: 4,
        },
        {
          listingId: 3, //reviewId: 7
          userId: 4,
          review: "had a great fight camp here! ground game go crazy",
          stars: 4,
        },
        {
          listingId: 2, //reviewId: 8
          userId: 4,
          review: "super chill coaches and killer team!",
          stars: 5,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        review: {
          [Op.in]: [
            "awesome fight gym!",
            "Had a great stay here!",
            "Clean place, pictures made it seem bigger.",
            "So close to the beach!",
            "Awesome Gym! Guys are ready for war",
            "had a great fight camp here! stand up go crazy",
            "had a great fight camp here! ground game go crazy",
            "super chill coaches and killer team!",
          ],
        },
      },
      {}
    );
  },
};
