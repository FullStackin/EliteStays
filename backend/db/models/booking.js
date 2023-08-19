"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: "userId" });
      Booking.belongsTo(models.Spot, { foreignKey: "spotId" });
    }
  }
  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Spots", key: "id" },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Spots", key: "id" },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        references: { model: "Spots", key: "id" },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          checkStartDate(value) {
            if (value <= this.startDate) {
              throw new Error("The endDate cannot be on or before startDate");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
