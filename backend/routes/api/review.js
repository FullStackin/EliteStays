const express = require("express");
const { Sequelize, json } = require("sequelize");
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
  ReviewImage,
  User,
} = require("../../db/models");
const router = express.Router();

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

// Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res, next) => {
  const userReviews = await Review.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
      },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
  });

  for (let i = 0; i < userReviews.length; i++) {
    const review = userReviews[i];
    const spot = review.Spot;

    let previewImage = await SpotImage.findOne({ where: { spotId: spot.id } });

    if (previewImage) {
      previewImage = previewImage.url;
    } else {
      previewImage = null;
    }

    spot.dataValues.previewImage = previewImage;
  }

  return res.status(200).json({
    userReviews,
  });
});

// Add an Image to the Review based on the ID of the reviews
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const { imageUrl } = req.body;

  const foundReview = await Review.findByPk(req.params.reviewId);

  if (!foundReview) {
    return res
      .status(404)
      .json({
        message:
          "The review you are trying to add an image to could not be found.",
      });
  }

  if (foundReview.userId !== req.user.id) {
    return res
      .status(403)
      .json({
        message:
          "Access Denied. You are not allowed to add an image to this review.",
      });
  }

  const allImages = await ReviewImage.findAll({
    where: {
      reviewId: foundReview.id,
    },
  });

  if (allImages.length >= 10) {
    return res
      .status(403)
      .json({
        message:
          "The maximum number of images for this review has been reached.",
      });
  } else {
    const newImage = await ReviewImage.create({
      reviewId: foundReview.id,
      imageUrl,
    });

    return res.status(200).json({
      id: newImage.id,
      imageUrl: newImage.imageUrl,
    });
  }
});

//Update a Review
router.put(
  "/:reviewId",
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const { updatedReview, updatedStars } = req.body;
    const foundReview = await Review.findByPk(req.params.reviewId);

    if (!foundReview) {
      return res.status(404).json({
        message: "The review you are trying to update could not be found.",
      });
    }

    if (foundReview.userId !== req.user.id) {
      return res.status(403).json({
        message: "Access Denied. You are not allowed to update this review.",
      });
    }

    if (updatedReview) foundReview.review = updatedReview;
    if (updatedStars) foundReview.stars = updatedStars;

    await foundReview.save();

    return res.status(200).json(foundReview);
  }
);

//Remove a Review
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const foundReview = await Review.findByPk(req.params.reviewId);

  if (!foundReview) {
    return res.status(404).json({
      message: "The review you are trying to delete could not be found.",
    });
  }

  if (foundReview.userId !== req.user.id) {
    return res.status(403).json({
      message: "Access Denied. You are not allowed to delete this review.",
    });
  }

  await foundReview.destroy();

  return res.status(200).json({
    message: "Review successfully removed.",
  });
});

module.exports = router;
