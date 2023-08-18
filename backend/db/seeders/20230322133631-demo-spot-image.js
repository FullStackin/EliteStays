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
        // Spot #1
        {
          spotId: 1,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141808416340332664/7e2b0bd6d9d5fda9ea1766a9181a39b1-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141808449194315866/7696a68e132eb0ae2db54ecb21009e4e-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141808772147326976/7d296a75ce5f7a5d3c521a32cdb9f3b1-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141808596947054705/25b66c0ca399c0c97a5c6a6036f66bac-cc_ft_576.png",
          preview: true,
        },
        // Spot #2
        {
          spotId: 2,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141809628016029826/cc2cdab4599a09d93c856cfcd5b97a84-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141809628812943440/ae345c2bcddd0809ef52f35e74ad3e83-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141809628267696208/2832465eb54577747d5a73d2d0380a0c-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141809629165256845/c6589adadb3825d74beaa82b3a184313-cc_ft_576.png",
          preview: true,
        },
        // Spot #3
        {
          spotId: 3,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141810356436607056/eaf8b82959673a489d29f59dc55e676d-cc_ft_960.png",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141810356784738344/0c8f6aaf7dc3164a0eca061fdd935308-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141810357028012082/7181bb2de72d3a3487cda0b8585f91ea-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141810357267083285/a932c4f3f648ff8d17c264f92f779191-cc_ft_576.png",
          preview: true,
        },
        // Spot #4
        {
          spotId: 4,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141812603014889522/714edbe90d3d8ee6b1122b8d8767415c-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141812603333640252/509e3abd8b5638a756e57a3cbb181139-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141812603987968130/325807e345b0ef8e52b2ab031a8d5661-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141812603631439983/b6c7c2edfc996d35821c8e50b68f15e1-cc_ft_576.png",
          preview: true,
        },
        // Spot #5
        {
          spotId: 5,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141816637855633499/Screenshot_2023-08-17_at_12.30.17_PM.png",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141816638174408714/Screenshot_2023-08-17_at_12.30.42_PM.png",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141816638488985790/Screenshot_2023-08-17_at_12.31.04_PM.png",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141816638958735510/Screenshot_2023-08-17_at_12.31.35_PM.png",
          preview: true,
        },
        // Spot #6
        {
          spotId: 6,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141824767448596600/Screenshot_2023-08-17_at_1.01.50_PM.png",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141824768555876362/Screenshot_2023-08-17_at_1.02.33_PM.png",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141824768987901972/Screenshot_2023-08-17_at_1.02.59_PM.png",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141824769432490074/Screenshot_2023-08-17_at_1.03.50_PM.png",
          preview: true,
        },
        // Spot #7
        {
          spotId: 7,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141826328551763998/bb32f89c794672be456655df0c056d2d-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141826329440944138/251e6d9ff57da165e62ff951b160f5b7-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141826330032361603/6794e531c8d99ff1909a6ef11d883959-cc_ft_576.png",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141826330367897742/9cd0ff86f1f62e3326ff2c9d4d55a76f-cc_ft_576.png",
          preview: true,
        },
        // Spot #8
        {
          spotId: 8,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141831607007858708/27e1236b-a3a2-489a-a2d0-3ab694725df0.png",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141831607506960494/b87a97ad-09e1-4404-a3f1-599bccb1f135.png",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141831608069017710/Screenshot_2023-08-17_at_1.30.26_PM.png",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141831608438096023/Screenshot_2023-08-17_at_1.30.48_PM.png",
          preview: true,
        },
        // Spot #9
        {
          spotId: 9,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141833303528312883/Screenshot_2023-08-17_at_1.36.52_PM.png",
          preview: true,
        },
        {
          spotId: 9,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141833304623038605/Screenshot_2023-08-17_at_1.37.41_PM.png",
          preview: true,
        },
        {
          spotId: 9,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141833303872241664/Screenshot_2023-08-17_at_1.37.19_PM.png",
          preview: true,
        },
        {
          spotId: 9,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141833305034080326/9cc593a8-3124-4606-9bc8-5639ded51230.png",
          preview: true,
        },
        // Spot #10
        {
          spotId: 10,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141834126039724042/Screenshot_2023-08-17_at_1.40.24_PM.png",
          preview: true,
        },
        {
          spotId: 10,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141834126429782112/Screenshot_2023-08-17_at_1.40.37_PM.png",
          preview: true,
        },
        {
          spotId: 10,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141834126824058982/a1dcb8b1-9831-4320-b76b-d7ef39f2ef24.png",
          preview: true,
        },
        {
          spotId: 10,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141834127197343907/acfb63b3-d4cc-4dff-957d-936bf40c1ec5.png",
          preview: true,
        },
        // Spot #11
        {
          spotId: 11,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141847048472244374/70d0027a-8c77-4c06-a8e1-8a5b6daa85ed.png",
          preview: true,
        },
        {
          spotId: 11,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141847049093009418/2dfc8784-0dc5-4853-981a-9f59fb0517c0.png",
          preview: true,
        },
        {
          spotId: 11,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141847049499840612/aa2e535b-7336-46c6-af17-f748105de141.png",
          preview: true,
        },
        {
          spotId: 11,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141847049986388098/e0570bbd-a488-41cb-ae13-c7ae7bf9aed9.png",
          preview: true,
        },
        // Spot #12
        {
          spotId: 12,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141848837611335701/af4389ce-56d7-44ea-ab7d-f884b66585a8.png",
          preview: true,
        },
        {
          spotId: 12,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141848837955264522/d52a3b5d-60b9-419b-8cfe-a02ae08aeb77.png",
          preview: true,
        },
        {
          spotId: 12,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141848838244683827/56fc2639-3e6d-4c0a-8df2-98625c7eb727.png",
          preview: true,
        },
        {
          spotId: 12,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141848838567636992/eff60d7f-c51f-4517-a4a5-73c90fef15d7.png",
          preview: true,
        },
        // Spot #13
        {
          spotId: 13,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141850373523517500/ca11b484-eb84-4d8c-a5d8-09c766940387.png",
          preview: true,
        },
        {
          spotId: 13,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141850373817106623/33bd53b7-6d95-4878-bca8-a28ceb72afb8.png",
          preview: true,
        },
        {
          spotId: 13,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141850374093938780/7e9c72ca-ed60-43b3-b44c-0b59aea75f1a.png",
          preview: true,
        },
        {
          spotId: 13,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141850374395932873/2b22c985-3dc8-4ca8-b870-5d4b3789abfd.png",
          preview: true,
        },
        // Spot #14
        {
          spotId: 14,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141852453600497836/3fe38220-8d50-4b79-bfe6-9967141ba014.png",
          preview: true,
        },
        {
          spotId: 14,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141852453910892595/e091891c-5b05-49fd-987c-2af20afc8721.png",
          preview: true,
        },
        {
          spotId: 14,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141852453189460098/a4cd9acb-8b9e-4659-b9b1-5015e557005e.png",
          preview: true,
        },
        {
          spotId: 14,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141852452916826182/322303de-c57f-47a9-9385-f1a3864c5c5c.png",
          preview: true,
        },
        {
          spotId: 14,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141887962603339796/dd8eadd7-fffa-43e1-b87e-7e74fac852bc.png",
          preview: true,
        },
        // Spot #15
        {
          spotId: 15,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141853193219870801/93cb14f2-371e-4797-bf98-123f614cd8ed.png",
          preview: true,
        },
        {
          spotId: 15,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141853194050342962/7653bb5f-4a1b-469e-98b7-2ebeb1dc074c.png",
          preview: true,
        },
        {
          spotId: 15,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141853193693831268/c2546bc7-0408-4277-be1b-4f5ab0db7f01.png",
          preview: true,
        },
        {
          spotId: 15,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141853194406862888/Screenshot_2023-08-17_at_2.56.47_PM.png",
          preview: true,
        },
        {
          spotId: 15,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1141887419361263667/e2de6918-f23f-4b52-969b-2c5794573a51.png",
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
