"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.bulkInsert(
      options,
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
          price: 12000.0,
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
          price: 14000,
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
          price: 34000,
        },
        {
          ownerId: 4,
          address: "789 Palms Boulevard",
          city: "Los Angeles",
          state: "CA",
          country: "USA",
          lat: 25.09,
          lng: 66.35,
          name: "LA Coastal Living",
          description:
            "Contemporary coastal home in Los Angeles offering city and ocean views.",
          price: 10000,
        },
        {
          ownerId: 5,
          address: "1001 Magnolia Lane",
          city: "Aspen",
          state: "CO",
          country: "USA",
          lat: 39.18,
          lng: 106.83,
          name: "Mountain Majesty",
          description:
            "Elevate your senses in this luxurious Aspen mountain retreat.",
          price: 18000.0,
        },
        {
          ownerId: 6,
          address: "7898 Sunset Boulevard",
          city: "Beverly Hills",
          state: "CA",
          country: "USA",
          lat: 34.08,
          lng: 118.39,
          name: "Hollywood Hills Haven",
          description:
            "Immerse yourself in opulence in the heart of Beverly Hills.",
          price: 25000,
        },
        {
          ownerId: 7,
          address: "876 Gold Coast Drive",
          city: "Miami",
          state: "FL",
          country: "USA",
          lat: 25.76,
          lng: 80.19,
          name: "Miami Beachfront Oasis",
          description:
            "Experience the vibrant Miami lifestyle in this beachfront oasis.",
          price: 22000,
        },
        {
          ownerId: 8,
          address: "456 Royal Gardens",
          city: "London",
          state: "England",
          country: "UK",
          lat: 51.51,
          lng: -0.13,
          name: "Unplug and escape off the grid",
          description: "Indulge in regal elegance in the great out doors.",
          price: 28000,
        },
        {
          ownerId: 9,
          address: "987 Prestige Plaza",
          city: "Paris",
          state: "Île-de-France",
          country: "France",
          lat: 48.86,
          lng: 2.34,
          name: "Eiffel Elegance",
          description:
            "Experience Parisian charm with stunning views of the Eiffel Tower.",
          price: 32000,
        },
        {
          ownerId: 10,
          address: "345 Luxe Lane",
          city: "Dubai",
          state: "Dubai",
          country: "UAE",
          lat: 25.2,
          lng: 55.27,
          name: "Desert Oasis Retreat",
          description:
            "Discover luxury in the heart of the Arabian Desert with skyline views.",
          price: 30000,
        },
        {
          ownerId: 11,
          address: "123 Beachfront Bliss",
          city: "Nassau",
          state: "New Providence",
          country: "Bahamas",
          lat: 25.0343,
          lng: -77.3963,
          name: "Tropical Paradise Villa",
          description:
            "Experience the beauty of the Caribbean in this beachfront villa.",
          price: 28000,
        },
        {
          ownerId: 12,
          address: "234 Shani Road",
          city: "Nice",
          state: "Provence-Alpes-Côte d'Azur",
          country: "France",
          lat: 43.7,
          lng: 7.26,
          name: "French Riviera Villa",
          description:
            "Experience the allure of the French Riviera in this glamorous villa.",
          price: 27000,
        },
        {
          ownerId: 13,
          address: "567 Amri Street",
          city: "Tokyo",
          state: "Tokyo",
          country: "Japan",
          lat: 35.68,
          lng: 139.76,
          name: "Tokyo Tranquility",
          description:
            "Find tranquility in the heart of Tokyo's bustling cityscape.",
          price: 10000,
        },
        {
          ownerId: 14,
          address: "Petra Wadi Zay",
          city: "Ma'an",
          state: "Ma'an Governorate",
          country: "Jordan",
          lat: 30.3285,
          lng: 35.4444,
          name: "Luxurious Petra Retreat",
          description:
            "Experience the wonders of Petra with this elegant retreat.",
          price: 45000,
        },
        {
          ownerId: 15,
          address: "789 laylay Avenue",
          city: "Bora Bora",
          state: "Bora Bora",
          country: "French Polynesia",
          lat: -16.5,
          lng: -151.74,
          name: "Tropical Paradise Villa",
          description:
            "Escape to an exotic paradise in this overwater bungalow.",
          price: 38000,
        },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.bulkDelete(options);
  },
};
