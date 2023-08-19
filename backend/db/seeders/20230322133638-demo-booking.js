"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

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
          spotId: 4,
          userId: 4,
          startDate: new Date("2023-09-01"),
          endDate: new Date("2023-09-07"),
        },
        {
          spotId: 5,
          userId: 5,
          startDate: new Date("2023-08-25"),
          endDate: new Date("2023-08-31"),
        },
        {
          spotId: 6,
          userId: 6,
          startDate: new Date("2023-09-10"),
          endDate: new Date("2023-09-16"),
        },
        {
          spotId: 7,
          userId: 7,
          startDate: new Date("2023-09-18"),
          endDate: new Date("2023-09-25"),
        },
        {
          spotId: 8,
          userId: 8,
          startDate: new Date("2023-10-01"),
          endDate: new Date("2023-10-07"),
        },
        {
          spotId: 9,
          userId: 9,
          startDate: new Date("2023-10-10"),
          endDate: new Date("2023-10-15"),
        },
        {
          spotId: 10,
          userId: 10,
          startDate: new Date("2023-09-25"),
          endDate: new Date("2023-10-03"),
        },
        {
          spotId: 11,
          userId: 11,
          startDate: new Date("2023-09-12"),
          endDate: new Date("2023-09-18"),
        },
        {
          spotId: 12,
          userId: 12,
          startDate: new Date("2023-09-22"),
          endDate: new Date("2023-09-29"),
        },
        {
          spotId: 13,
          userId: 13,
          startDate: new Date("2023-10-05"),
          endDate: new Date("2023-10-10"),
        },
        {
          spotId: 14,
          userId: 14,
          startDate: new Date("2023-08-28"),
          endDate: new Date("2023-09-04"),
        },
        {
          spotId: 15,
          userId: 15,
          startDate: new Date("2023-10-12"),
          endDate: new Date("2023-10-20"),
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
        spotId: {
          [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        },
      },
      {}
    );
  },
};
