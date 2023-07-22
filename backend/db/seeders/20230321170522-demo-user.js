'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Demo',
        lastName: 'Man',
        email: 'demo@aa.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Elon',
        lastName: 'Musk',
        email: 'Musky@aa.io',
        username: 'SpaceTesla',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Omar',
        lastName: 'El Sahlah',
        email: 'Omar@aa.io',
        username: 'TallTechTitan',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkDelete(options);
  }
};
