"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 2,
          startDate: new Date("2023-08-15"),
          endDate: new Date("2023-08-23"),
        },
        {
          spotId: 2,
          userId: 3,
          startDate: new Date("2023-10-15"),
          endDate: new Date("2023-10-20"),
        },
        {
          spotId: 3,
          userId: 1,
          startDate: new Date("2023-10-16"),
          endDate: new Date("2023-10-22"),
        },
        {
          spotId: 2,
          userId: 1,
          startDate: new Date("2023-09-15"),
          endDate: new Date("2023-09-30"),
        },
        {
          spotId: 2,
          userId: 3,
          startDate: new Date("2023-09-16"),
          endDate: new Date("2023-09-18"),
        },
        {
          spotId: 1,
          userId: 3,
          startDate: new Date("2023-08-31"),
          endDate: new Date("2023-09-06"),
        },
        {
          spotId: 2,
          userId: 3,
          startDate: new Date("2023-10-01"),
          endDate: new Date("2023-10-07"),
        },
        {
          spotId: 1,
          userId: 1,
          startDate: new Date("2023-09-14"),
          endDate: new Date("2023-09-21"),
        },
        {
          spotId: 2,
          userId: 1,
          startDate: new Date("2023-08-15"),
          endDate: new Date("2023-08-20"),
        },
        {
          spotId: 1,
          userId: 3,
          startDate: new Date("2023-09-15"),
          endDate: new Date("2023-09-21"),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
