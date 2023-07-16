"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

let options = {};

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Spots"
    return queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          name: "American Kickboxing Academy",
          address: "7012 Realm Dr, San Jose, CA 95119",
          city: "San Jose",
          state: "California",
          country: "United States of America",
          lat: 37.383157,
          lng: -121.925056,
          price: 150.00,
          description: "Famous gym where Khabib Nurmagomedov trained",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 2,
          name: "Jackson Wink MMA Academy",
          address: "301 Dr Martin Luther King Jr Ave NE, Albuquerque, NM 87102",
          city: "Albuquerque",
          state: "New Mexico",
          country: "United States of America",
          lat: 35.083775,
          lng: -106.598693,
          price: 120.00,
          description: "Renowned gym where Jon Jones trained",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 3,
          name: "SBG Ireland",
          address: "1450 San Pablo Ave, Berkeley, CA 94702",
          city: "Dublin",
          state: "County Dublin",
          country: "Ireland",
          price: 135.00,
          lat: 53.338365,
          lng: -6.260225,
          description: "Notable gym associated with Conor McGregor",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 4,
          name: "Sweat MMA",
          address: "2715 Montecito Vista Way",
          city: "San Jose",
          state: "California",
          country: "United States of America",
          price: 99.00,
          lat: 37.29089,
          lng: -121.85486,
          description: "Upcoming gym for MMA training",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    options.tableName = "Spots"
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "American Kickboxing Academy",
            "Jackson Wink MMA Academy",
            "SBG Ireland",
            "Sweat MMA",
          ],
        },
      },
      {}
    );
  },
};
