"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ListingImage extends Model {
    static associate(models) {
      ListingImage.belongsTo(models.Listing, { foreignKey: "listingId" });
    }
  }
  ListingImage.init(
    {
      listingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ListingImage",
    }
  );
  return ListingImage;
};
