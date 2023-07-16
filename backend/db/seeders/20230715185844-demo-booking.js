"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 1,
          startDate: "2023-07-18",
          endDate: "2023-09-19",
        },
        {
          spotId: 2,
          userId: 2,
          startDate: "2023-07-20",
          endDate: "2023-09-25",
        },
        {
          spotId: 3,
          userId: 3,
          startDate: "2023-07-19",
          endDate: "2023-09-26",
        },
        {
          spotId: 4,
          userId: 4,
          startDate: "2023-07-18",
          endDate: "2023-09-20",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        startDate: {
          [Op.eq]: ["2023-07-18", "2023-07-20", "2023-07-19", "2023-07-18"],
        },
      },
      {}
    );
  },
};
