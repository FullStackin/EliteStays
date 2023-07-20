'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    static associate(models) {
      Listing.hasMany(models.Review, {foreignKey: 'listingId', onDelete: 'CASCADE',  hooks: true})
      Listing.hasMany(models.ListingImage, {foreignKey: 'listingId', onDelete: 'CASCADE',  hooks: true})
      Listing.belongsTo(models.User, {foreignKey: 'ownerId',  as: 'Owner'})
      Listing.hasMany(models.Booking, {foreignKey: 'listingId', onDelete: 'CASCADE',  hooks: true})
    }
  }
  Listing.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Listing',
  });
  return Listing;
};
