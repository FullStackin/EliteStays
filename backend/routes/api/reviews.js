const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// Middleware to check if the review belongs to the authenticated user
const checkReviewOwnership = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  try {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        message: "Review couldn't be found",
        statusCode: 404,
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        message: "Forbidden",
        statusCode: 403,
      });
    }

    req.review = review; // Attach the review object to the request for later use
    next();
  } catch (err) {
    next(err);
  }
};

// Validation for review data
const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

// Get all reviews of the authenticated user
router.get("/current", requireAuth, async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Spot,
          include: { model: SpotImage },
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
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });

    const reviewList = reviews.map((review) => {
      const reviewJSON = review.toJSON();
      if (!reviewJSON.Spot.SpotImages.length) {
        reviewJSON.Spot.previewImage = "No preview image found";
      } else {
        reviewJSON.Spot.previewImage = reviewJSON.Spot.SpotImages[0].url;
      }

      delete reviewJSON.Spot.SpotImages;
      return reviewJSON;
    });

    return res.json({ Reviews: reviewList });
  } catch (err) {
    next(err);
  }
});

// Add review image
router.post(
  "/:reviewId/images",
  requireAuth,
  checkReviewOwnership,
  async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const url = req.body.url;

    try {
      const review = req.review;
      if (review.ReviewImages.length >= 10) {
        return res.status(403).json({
          message: "Maximum number of images for this resource was reached",
          statusCode: 403,
        });
      }

      const img = await ReviewImage.create({ reviewId, url });
      const imgJSON = img.toJSON();
      res.json(imgJSON);
    } catch (err) {
      next(err);
    }
  }
);

// Edit a review
router.put(
  "/:reviewId",
  requireAuth,
  checkReviewOwnership,
  validateReview,
  async (req, res, next) => {
    const { review, stars } = req.body;

    try {
      const reviewId = req.params.reviewId;
      const updateReview = await Review.findByPk(reviewId);
      await updateReview.set({
        review,
        stars,
      });

      await updateReview.save();

      return res.status(200).json(updateReview);
    } catch (err) {
      next(err);
    }
  }
);

// Delete review
router.delete(
  "/:reviewId",
  requireAuth,
  checkReviewOwnership,
  async (req, res, next) => {
    const reviewId = req.params.reviewId;

    try {
      await req.review.destroy();
      res.json({
        message: "Successfully deleted",
        statusCode: 200,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Test router setup
router.get("/test", function (req, res) {
  res.send("endpoint hit");
});

module.exports = router;
