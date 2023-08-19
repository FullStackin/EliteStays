"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 4,
          review: "Amazing view and luxurious amenities!",
          stars: 5,
        },
        {
          spotId: 1,
          userId: 5,
          review: "Had a fantastic stay, would come back again.",
          stars: 4,
        },
        {
          spotId: 2,
          userId: 6,
          review: "Breathtaking views of the ocean from the property.",
          stars: 5,
        },
        {
          spotId: 2,
          userId: 7,
          review: "Well-maintained and perfect for a relaxing getaway.",
          stars: 4,
        },
        {
          spotId: 2,
          userId: 8,
          review: "Spent a lovely vacation here, very peaceful.",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 9,
          review: "Worth every penny, the beach access was a highlight!",
          stars: 5,
        },
        {
          spotId: 3,
          userId: 10,
          review: "The best vacation spot I've ever been to.",
          stars: 5,
        },
        {
          spotId: 3,
          userId: 11,
          review: "Loved the privacy and elegance of this property.",
          stars: 5,
        },
        {
          spotId: 4,
          userId: 12,
          review: "Spectacular city and ocean views, truly unique!",
          stars: 5,
        },
        {
          spotId: 4,
          userId: 13,
          review: "Modern and comfortable, perfect for a city escape.",
          stars: 4,
        },
        {
          spotId: 5,
          userId: 14,
          review: "Unmatched beauty and luxury in the mountains.",
          stars: 5,
        },
        {
          spotId: 5,
          userId: 15,
          review: "Cozy atmosphere, a great spot to unwind.",
          stars: 4,
        },
        {
          spotId: 5,
          userId: 1,
          review: "The scenery was like something out of a fairy tale.",
          stars: 5,
        },
        {
          spotId: 6,
          userId: 2,
          review: "Top-notch amenities and a celebrity-worthy stay.",
          stars: 5,
        },
        {
          spotId: 6,
          userId: 3,
          review: "Exquisite property with unmatched opulence.",
          stars: 5,
        },
        {
          spotId: 6,
          userId: 4,
          review: "Stunning interior design and luxurious comfort.",
          stars: 5,
        },
        {
          spotId: 7,
          userId: 5,
          review: "Perfect location for a lively Miami experience.",
          stars: 4,
        },
        {
          spotId: 7,
          userId: 6,
          review: "Beachfront paradise with vibrant city vibes.",
          stars: 5,
        },
        {
          spotId: 8,
          userId: 7,
          review: "True escape from the city, loved every moment.",
          stars: 5,
        },
        {
          spotId: 9,
          userId: 8,
          review: "Unforgettable experience with breathtaking views.",
          stars: 5,
        },
        {
          spotId: 9,
          userId: 9,
          review: "Charming and romantic, perfect for couples.",
          stars: 4,
        },
        {
          spotId: 10,
          userId: 10,
          review: "Immersed in luxury and surrounded by desert beauty.",
          stars: 5,
        },
        {
          spotId: 10,
          userId: 11,
          review: "Unique experience with stunning skyline views.",
          stars: 4,
        },
        {
          spotId: 10,
          userId: 12,
          review: "Unmatched luxury in the heart of the desert.",
          stars: 5,
        },
        {
          spotId: 11,
          userId: 13,
          review: "A dreamy beachfront villa with Caribbean charm.",
          stars: 5,
        },
        {
          spotId: 11,
          userId: 14,
          review: "Relaxing stay with easy access to the beach.",
          stars: 4,
        },
        {
          spotId: 12,
          userId: 15,
          review: "Glamorous villa with Riviera elegance.",
          stars: 5,
        },
        {
          spotId: 12,
          userId: 1,
          review: "Exquisite property that captures the essence of Nice.",
          stars: 5,
        },
        {
          spotId: 12,
          userId: 2,
          review: "Loved the French Riviera vibes, a memorable stay.",
          stars: 5,
        },
        {
          spotId: 13,
          userId: 3,
          review: "An oasis of calm in the bustling city of Tokyo.",
          stars: 4,
        },
        {
          spotId: 13,
          userId: 4,
          review: "Serene and beautiful, a hidden gem in Tokyo.",
          stars: 5,
        },
        {
          spotId: 14,
          userId: 5,
          review: "Unforgettable experience near the wonders of Petra.",
          stars: 5,
        },
        {
          spotId: 14,
          userId: 6,
          review: "Elegant and comfortable stay, highly recommended.",
          stars: 4,
        },
        {
          spotId: 15,
          userId: 7,
          review: "Paradise found in Bora Bora, a dream come true.",
          stars: 5,
        },
        {
          spotId: 15,
          userId: 8,
          review: "Overwater bungalow with unbeatable views.",
          stars: 5,
        },
        {
          spotId: 15,
          userId: 9,
          review: "Exotic and relaxing, a perfect tropical escape.",
          stars: 5,
        },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
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
