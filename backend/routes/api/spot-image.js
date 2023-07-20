const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Listing, Booking, ListingImage } = require("../../db/models");

const { Op } = require("sequelize");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  try {
    const foundImage = await ListingImage.findByPk(req.params.imageId);

    if (!foundImage) {
      return res.status(404).json({
        message: "The listing image you are trying to delete could not be found.",
      });
    }

    const foundListing = await Listing.findOne({
      where: {
        id: foundImage.listingId,
      },
    });

    if (foundListing.ownerId !== req.user.id) {
      return res.status(403).json({
        message:
          "Access Denied. You are not allowed to delete this listing image.",
      });
    }

    await foundImage.destroy();

    return res.status(200).json({
      message: "Listing image successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
