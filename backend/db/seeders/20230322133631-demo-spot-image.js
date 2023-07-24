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
    options.tableName = "SpotImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          url: "https://cdn.discordapp.com/attachments/1132975397701693480/1132975483324223508/LA1.png",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://cdn.discordapp.com/attachments/1132975397701693480/1132975483714277416/LA2.png",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://cdn.discordapp.com/attachments/1132975397701693480/1132975484221804571/MLB1.png",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://cdn.discordapp.com/attachments/1132975397701693480/1132975484897079359/MLB2.png",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://cdn.discordapp.com/attachments/1132975397701693480/1132975485995995169/SB1.png",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://cdn.discordapp.com/attachments/1132975397701693480/1132975486990037013/SB2.png",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://cdn.discordapp.com/attachments/1132975397701693480/1132975487673700432/SD1.png",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://cdn.discordapp.com/attachments/1132975397701693480/1132975488449663017/SD2.png",
          preview: true,
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
    options.tableName = "SpotImages";
    return queryInterface.bulkDelete(options);
  },
};
