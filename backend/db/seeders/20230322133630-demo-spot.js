"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    options.tableName = "Spots";
    return queryInterface.bulkInsert(
      options.tableName,
      [
        // Adjust the method call here
        {
          ownerId: 1,
          address: "1994 Grand Street",
          city: "San Diego",
          state: "CA",
          country: "USA",
          lat: 44.01,
          lng: 90.01,
          name: "The Beauty",
          description: "Beautiful home on Coronado Island in San Diego, CA",
          price: 10.01,
        },
        {
          ownerId: 2,
          address: "123 Ocean Avenue",
          city: "Santa Barbara",
          state: "CA",
          country: "USA",
          lat: 34.42,
          lng: 119.7,
          name: "Coastal Retreat",
          description:
            "Stunning coastal retreat in Santa Barbara with ocean views.",
          price: 25.01,
        },
        {
          ownerId: 3,
          address: "456 Beachfront Drive",
          city: "Malibu",
          state: "CA",
          country: "USA",
          lat: 22.02,
          lng: 150.8,
          name: "Malibu Paradise",
          description:
            "Luxurious beachfront property in Malibu with private beach access.",
          price: 45.01,
        },
        {
          ownerId: 3,
          address: "789 Palms Boulevard",
          city: "Los Angeles",
          state: "CA",
          country: "USA",
          lat: 25.09,
          lng: 66.35,
          name: "LA Coastal Living",
          description:
            "Contemporary coastal home in Los Angeles offering city and ocean views.",
          price: 30.01,
        },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Spots";
    return queryInterface.bulkDelete(options.tableName, null, {}); // Adjust the method call here
  },
};
