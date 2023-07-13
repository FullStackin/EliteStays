'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          firstName: "Jon",
          lastName: "Jones",
          email: "Bones@aa.io",
          username: "JohnnyBonesJones",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Khabib",
          lastName: "Nurmagomedov",
          email: "Eagle@aa.io",
          username: "TheEagle",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Connor",
          lastName: "McGregor",
          email: "Proper@aa.io",
          username: "Proper12",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "Omar",
          lastName: "El Sahlah",
          email: "TheBull@aa.io",
          username: "OmarTheBull",
          hashedPassword: bcrypt.hashSync("password4"),
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
        username: {
          [Op.in]: ["JohnnyBonesJones", "TheEagle", "Proper12", "OmarTheBull"],
        },
      },
      {}
    );
  },
};
