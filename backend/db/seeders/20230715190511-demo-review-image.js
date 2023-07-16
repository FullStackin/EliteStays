"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "ReviewImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          reviewId: 1,
          url: "reviewImageOne_url",
        },
        {
          reviewId: 2,
          url: "reviewImageTwo_url",
        },
        {
          reviewId: 3,
          url: "reviewImageThree_url",
        },
        {
          reviewId: 4,
          url: "reviewImageFour_url",
        },
        {
          reviewId: 5,
          url: "reviewImageFive_url",
        },
        {
          reviewId: 6,
          url: "reviewImageSix_url",
        },
        {
          reviewId: 7,
          url: "reviewImageSeven_url",
        },
        {
          reviewId: 8,
          url: "reviewImageEight_url",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: {
          [Op.in]: [
            "reviewImageOne_url",
            "reviewImageTwo_url",
            "reviewImageThree_url",
            "reviewImageFour_url",
            "reviewImageFive_url",
            "reviewImageSix_url",
            "reviewImageSeven_url",
            "reviewImageEight_url"
          ],
        },
      },
      {}
    );
  },
};
