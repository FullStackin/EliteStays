"use strict";

const bcrypt = require("bcryptjs");

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const options = {}; // Declare and initialize the options object
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          email: "demo@user.io",
          username: "Demo-lition",
          firstName: "Demo",
          lastName: "Lition",
          hashedPassword: bcrypt.hashSync("password"), // Increase the number of rounds for bcrypt.hashSync()
        },
        {
          firstName: "Jon",
          lastName: "Jones",
          email: "Bones@aa.io",
          username: "JBJon",
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
    const options = {}; // Declare and initialize the options object
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      {
        username: {
          [Op.in]: ["JBJ", "TheEagle", "Proper12", "OmarTheBull"],
        },
      },
      {}
    );
  },
};
