"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "ListingImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          listingId: 1,
          url: "Images from gym url 1",
          preview: true,
        },
        {
          listingId: 1,
          url: "Images from gym url 1",
          preview: false,
        },
        {
          listingId: 2,
          url: "Images from gym url 2",
          preview: false,
        },
        {
          listingId: 2,
          url: "Images from gym url 2",
          preview: true,
        },
        {
          listingId: 3,
          url: "Images from gym url 3",
          preview: true,
        },
        {
          listingId: 3,
          url: "Images from gym url 3",
          preview: false,
        },
        {
          listingId: 4,
          url: "Images from gym url 4",
          preview: true,
        },
        {
          listingId: 4,
          url: "Images from gym url 4",
          preview: false,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "ListingImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: {
          [Op.in]: [
            "Images from gym url 1",
            "Images from gym url 1",
            "Images from gym url 2",
            "Images from gym url 2",
            "Images from gym url 3",
            "Images from gym url 3",
            "Images from gym url 4",
            "Images from gym url 4",
          ],
        },
      },
      {}
    );
  },
};
