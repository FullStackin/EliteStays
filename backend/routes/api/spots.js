const express = require("express");
const { Op } = require("sequelize");

const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");

const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  multipleMulterUpload,
  multipleFilesUpload,
  retrievePrivateFile,
} = require("../../awsS3");

const { route } = require("./spots");

const router = express.Router();

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

//get all spots
router.get("/", async (req, res) => {
  let query = {
    where: {},
  };

  let {
    page,
    size,
    minLat,
    maxLat,
    minLng,
    maxLng,
    minPrice,
    maxPrice,
    name,
    checkInDate,
    checkOutDate,
  } = req.query;

  if (page < 1) {
    return res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        page: "Page must be greater than or equal to 1",
      },
    });
  }

  if (size < 1) {
    return res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        size: "Size must be greater than or equal to 1",
      },
    });
  }

  if (Number.isNaN(minLat)) {
    return res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        minLat: "Minimum latitude is invalid",
      },
    });
  }

  if (Number.isNaN(maxLat)) {
    return res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        maxLat: "Maximum latitude is invalid",
      },
    });
  }

  if (Number.isNaN(minLng)) {
    return res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        minLng: "Minimum longitude is invalid",
      },
    });
  }

  if (Number.isNaN(maxLng)) {
    return res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        maxLng: "Maximum longitude is invalid",
      },
    });
  }

  if (minPrice < 0) {
    return res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        minPrice: "Minimum price must be greater than or equal to 0",
      },
    });
  }

  if (maxPrice < 0) {
    return res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        maxPrice: "Maximum price must be greater than or equal to 0",
      },
    });
  }

  page = parseInt(page);
  size = parseInt(size);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(size) || size < 1 || size > 20) size = 20;
  if (page > 10) page = 10;

  let pagination = {};
  let where = {};

  pagination.limit = size;
  pagination.offset = size * (page - 1);

  if (minLat) where.lat = { [Op.gte]: minLat };
  if (maxLat) where.lat = { [Op.lte]: maxLat };
  if (minLng) where.lng = { [Op.gte]: minLng };
  if (maxLng) where.lng = { [Op.lte]: maxLng };
  if (minPrice) where.price = { [Op.gte]: minPrice };
  if (maxPrice) where.price = { [Op.lte]: maxPrice };

  // Filter by name using a LIKE query
  if (name) where.name = { [Op.like]: `%${name}%` };

  const spots = await Spot.findAll({
    where,
    ...pagination,
    include: [{ model: SpotImage }, { model: Review }],
  });

  const spotList = [];

  spots.forEach((spot) => {
    spotList.push(spot.toJSON());
  });

  // Additional data filtering based on check-in and check-out dates
  if (checkInDate && checkOutDate) {
    const bookedSpots = await Spot.findAll({
      include: [
        {
          model: Booking,
          attributes: ["id", "startDate", "endDate"],
          where: {
            [Op.or]: [
              {
                startDate: {
                  [Op.lt]: checkOutDate,
                },
                endDate: {
                  [Op.gt]: checkInDate,
                },
              },
            ],
          },
        },
      ],
    });

    const bookedSpotIds = bookedSpots.map((spot) => spot.id);

    // Filter out booked spots from the results
    spotList = spotList.filter((spot) => !bookedSpotIds.includes(spot.id));
  }

  // Formatting the response structure
  spotList.forEach((spot) => {
    if (!spot.SpotImages.length) spot.previewImage = "No preview image found";
    else {
      spot.previewImage = spot.SpotImages[0].url;
      spot.preview = true;
    }

    delete spot.SpotImages;

    // Calculate average rating
    let count = 0;
    let sum = 0;

    spot.Reviews.forEach((review) => {
      count++;
      sum += review.stars;
    });

    spot.avgRating = count > 0 ? sum / count : 0;

    delete spot.Reviews;
  });

  // Returning the formatted response
  res.json({
    Spots: spotList,
    page,
    size,
  });
});

//get all current user's spots
router.get("/current", requireAuth, async (req, res) => {
  const spots = await Spot.findAll({
    where: {
      ownerId: req.user.id,
    },
    include: [{ model: SpotImage }, { model: Review }],
  });

  let spotList = [];
  spots.forEach((spot) => {
    spotList.push(spot.toJSON());
  });

  spotList.forEach((spot) => {
    if (!spot.SpotImages.length) spot.previewImage = "No preview image found";
    else {
      spot.previewImage = spot.SpotImages[0].url;
      spot.preview = true;
    }

    delete spot.SpotImages;
  });

  //calc avg rating given
  spotList.forEach((spot) => {
    let count = 0;
    let sum = 0;
    spot.Reviews.forEach((review) => {
      count++;
      sum += review.stars;
    });

    spot.avgRating = sum / count;

    delete spot.Reviews;
  });
  res.json({ Spots: spotList });
});

router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Review,
      },
    ],
  });

  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  const spotJSON = spot.toJSON();
  spotJSON.numReviews = spotJSON.Reviews.length;

  let sum = 0;
  let count = 0;
  spotJSON.Reviews.forEach((review) => {
    count++;
    sum += review.stars;
  });
  spotJSON.avgStarRating = sum / count;

  delete spotJSON.Reviews;

  res.json(spotJSON);
});

router.post("/:spotId/reviews", async (req, res) => {
  const { review, stars } = req.body;
  const userId = req.user.id;
  const spotId = req.params.spotId;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const existing = await Review.findAll({
    where: { userId: userId, spotId: spotId },
  });

  if (existing.length) {
    return res
      .status(403)
      .json({ message: "User already has a review for this spot" });
  }

  const newReview = await Review.create({
    userId,
    spotId,
    review,
    stars,
  });

  return res.status(201).json(newReview);
});

router.get("/:spotId/reviews", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  return res.status(200).json({ Reviews: reviews });
});

//Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId !== req.user.id) {
    const bookings = await Booking.findAll({
      where: {
        spotId: spot.id,
      },
      attributes: ["spotId", "startDate", "endDate", "id"],
    });

    return res.status(200).json({ Bookings: bookings });
  }

  if (spot.ownerId === req.user.id) {
    const bookings = await Booking.findAll({
      where: {
        spotId: spot.id,
      },
      include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
    });

    return res.status(200).json({ Bookings: bookings });
  }
});

//Create a Booking from a Spot based on the Spot's id
router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId === req.user.id) {
    return res.status(400).json({
      message: "You are the spot owner!",
    });
  }

  const checkStartDate = await Booking.findOne({
    where: {
      spotId: spot.id,
      startDate: { [Op.lte]: startDate },
      endDate: { [Op.gte]: startDate },
    },
  });

  if (checkStartDate) {
    const err = new Error(
      "Sorry, this spot is already booked for the specified dates"
    );
    err.error = {
      startDate: "Start date conflicts with an existing booking",
    };

    return res.status(403).json({
      message: err.message,
      errors: err.error,
    });
  }

  const checkEndDate = await Booking.findOne({
    where: {
      spotId: spot.id,
      startDate: { [Op.lte]: endDate },
      endDate: { [Op.gte]: endDate },
    },
  });

  if (checkEndDate) {
    const err = new Error(
      "Sorry, this spot is already booked for the specified dates"
    );
    err.error = {
      startDate: "End date conflicts with an existing booking",
    };

    return res.status(403).json({
      message: err.message,
      errors: err.error,
    });
  }

  const checkBothDate = await Booking.findOne({
    where: {
      spotId: spot.id,
      startDate: { [Op.gte]: startDate },
      endDate: { [Op.lte]: endDate },
    },
  });

  if (checkBothDate) {
    const err = new Error(
      "Sorry, this spot is already booked for the specified dates"
    );
    err.error = {
      startDate: "schedule conflict with an existing booking",
    };

    return res.status(403).json({
      message: err.message,
      errors: err.error,
    });
  }

  const newBooking = await Booking.create({
    spotId: spot.id,
    userId: req.user.id,
    startDate,
    endDate,
  });

  // console.log("newBooking in the route: ", newBooking);

  return res.status(200).json(newBooking);
});

router.post("/", requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const spot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  res.json(spot);
});

router.get("/:spotId/images", async (req, res, next) => {
  try {
    const spotId = req.params.spotId;

    const images = await SpotImage.findAll({
      where: {
        spotId: spotId,
      },
    });

    if (!images || images.length === 0) {
      return res.status(404).json({ error: "Images not found" });
    }

    // Construct an array of image URLs directly from the S3 bucket
    const imageUrlList = images.map(
      (image) => `https://elitestays.s3.us-west-1.amazonaws.com/${image.url}`
    );
    res.json(imageUrlList);
  } catch (error) {
    console.error("Error retrieving images:", error);
  }
});

router.post(
  "/:spotId/images",
  [requireAuth, multipleMulterUpload("images")],
  async (req, res, next) => {
    try {
      const spotId = req.params.spotId;

      // Upload images to S3 and get an array of image keys
      const keys = await multipleFilesUpload({ files: req.files });
      console.log(keys, " THIS ISS THE KEYSSS");
      // Create SpotImage records with the generated keys
      const images = await Promise.all(
        keys.map((key) =>
          SpotImage.create({
            url: key,
            spotId: parseInt(spotId), // turning string into number
            preview: false,
          })
        )
      );

      // Construct an array of image URLs directly from the S3 bucket
      console.log(images, " THESE ARE THE IMAGES!");
      const imageUrlList = images.map(
        (image) => `https://elitestays.s3.us-west-1.amazonaws.com/${image.url}`
      );
      res.json(imageUrlList);
    } catch (error) {
      console.error("Error uploading images:", error);
      return res.status(500).json({ error: "Failed to upload images." });
    }
  }
);

router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: "404",
    });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
      statusCode: "403",
    });
  }

  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.lat = lat;
  spot.lng = lng;
  spot.name = name;
  spot.description = description;
  spot.price = price;

  await spot.save();

  return res.status(200).json(spot);
});

//delete spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  if (spot.ownerId != userId) {
    return res.status(403).json({
      message: "Spot must belong to you",
      statusCode: 403,
    });
  }

  await spot.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

//test router setup
router.get("/test", function (req, res) {
  res.send("endpoint hit");
});

module.exports = router;
