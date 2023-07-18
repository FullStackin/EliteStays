const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Booking, SpotImage } = require("../../db/models");

const { Op } = require("sequelize");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  try {
    const foundImage = await SpotImage.findByPk(req.params.imageId);

    if (!foundImage) {
      return res.status(404).json({
        message: "The spot image you are trying to delete could not be found.",
      });
    }

    const foundSpot = await Spot.findOne({
      where: {
        id: foundImage.spotId,
      },
    });

    if (foundSpot.ownerId !== req.user.id) {
      return res.status(403).json({
        message:
          "Access Denied. You are not allowed to delete this spot image.",
      });
    }

    await foundImage.destroy();

    return res.status(200).json({
      message: "Spot image successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
