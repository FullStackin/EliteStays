const express = require("express");
const { Op } = require("sequelize");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");

const {
  Spot,
  SpotImage,
  Review,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  try {
    const foundImage = await ReviewImage.findByPk(req.params.imageId);

    if (!foundImage) {
      return res.status(404).json({
        message:
          "The review image you are trying to delete could not be found.",
      });
    }

    const foundReview = await Review.findOne({
      where: {
        id: foundImage.reviewId,
      },
    });

    if (foundReview.userId !== req.user.id) {
      return res.status(403).json({
        message:
          "Access Denied. You are not allowed to delete this review image.",
      });
    }

    await foundImage.destroy();

    return res.status(200).json({
      message: "Review image successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
