"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.bulkInsert(options, [
      {
        firstName: "Demo",
        lastName: "Man",
        email: "demo@aa.io",
        username: "Demo-lition",
        hashedPassword: bcrypt.hashSync("password"),
      },
      {
        firstName: "Elon",
        lastName: "Musk",
        email: "musky@aa.io",
        username: "SpaceTesla",
        hashedPassword: bcrypt.hashSync("password2"),
      },
      {
        firstName: "Omar",
        lastName: "El Sahlah",
        email: "omar@aa.io",
        username: "TallTechTitan",
        hashedPassword: bcrypt.hashSync("password3"),
      },
      {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        username: "JDoe",
        hashedPassword: bcrypt.hashSync("password4"),
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        username: "JSmith",
        hashedPassword: bcrypt.hashSync("password5"),
      },
      // Add more user data here
      {
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael@example.com",
        username: "MJohnson",
        hashedPassword: bcrypt.hashSync("password6"),
      },
      {
        firstName: "Emily",
        lastName: "Williams",
        email: "emily@example.com",
        username: "EWilliams",
        hashedPassword: bcrypt.hashSync("password7"),
      },
      {
        firstName: "David",
        lastName: "Brown",
        email: "david@example.com",
        username: "DBrown",
        hashedPassword: bcrypt.hashSync("password8"),
      },
      {
        firstName: "Sarah",
        lastName: "Jones",
        email: "sarah@example.com",
        username: "SJones",
        hashedPassword: bcrypt.hashSync("password9"),
      },
      {
        firstName: "Matthew",
        lastName: "Davis",
        email: "matthew@example.com",
        username: "MDavis",
        hashedPassword: bcrypt.hashSync("password10"),
      },
      {
        firstName: "Jessica",
        lastName: "Miller",
        email: "jessica@example.com",
        username: "JMiller",
        hashedPassword: bcrypt.hashSync("password11"),
      },
      {
        firstName: "William",
        lastName: "Wilson",
        email: "william@example.com",
        username: "WWilson",
        hashedPassword: bcrypt.hashSync("password12"),
      },
      {
        firstName: "Ava",
        lastName: "Taylor",
        email: "ava@example.com",
        username: "ATaylor",
        hashedPassword: bcrypt.hashSync("password13"),
      },
      {
        firstName: "Daniel",
        lastName: "Anderson",
        email: "daniel@example.com",
        username: "DAnderson",
        hashedPassword: bcrypt.hashSync("password14"),
      },
      {
        firstName: "Sophia",
        lastName: "Martinez",
        email: "sophia@example.com",
        username: "SMartinez",
        hashedPassword: bcrypt.hashSync("password15"),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.bulkDelete(options);
  },
};
