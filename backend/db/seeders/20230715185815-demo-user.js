"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "demo",
          lastName: "demo",
          email: "demo@user.io",
          username: "Demo-lition'",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Jon",
          lastName: "Jones",
          email: "Bones@aa.io",
          username: "JBJ",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Khabib",
          lastName: "Nurmagomedov",
          email: "Eagle@aa.io",
          username: "TheEagle",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Connor",
          lastName: "McGregor",
          email: "Proper@aa.io",
          username: "Proper12",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Omar",
          lastName: "El Sahlah",
          email: "TheBull@aa.io",
          username: "OmarTheBull",
          hashedPassword: bcrypt.hashSync("password"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
