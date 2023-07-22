const express = require("express");
const { Sequelize, json } = require("sequelize");
const { Op } = require("sequelize");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");

const {
  Listing,
  ListingImage,
  Review,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { route } = require("./listing");

const router = express.Router();

const validateListing = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .isLength({ min: 30 })
    .withMessage("Description needs at least 30 or more characters"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an number from 1 to 5"),
  handleValidationErrors,
];

// all listing route
router.get("/", async (req, res, next) => {
  try {
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

    if (!page) page = 1;
    if (!size) size = 100;
    if (page > 10) page = 10;
    if (size > 20) size = 100;

    page = parseInt(page);
    size = parseInt(size);

    if (page >= 1 && size >= 1) {
      query.limit = size;
      query.offset = size * (page - 1);
    }

    let errors = {};
    if (minLat && isNaN(minLat))
      errors.minLat = { message: "Minimum latitude is invalid" };
    if (maxLat && isNaN(maxLat))
      errors.maxLat = { message: "Maximum latitude is invalid" };
    if (minLng && isNaN(minLng))
      errors.minLng = { message: "Minimum longitude is invalid" };
    if (maxLng && isNaN(maxLng))
      errors.maxLng = { message: "Maximum longitude is invalid" };
    if (minPrice && (isNaN(minPrice) || minPrice < 0))
      errors.minPrice = {
        message: "Minimum price must be greater than or equal to 0",
      };
    if (maxPrice && (isNaN(maxPrice) || maxPrice < 0))
      errors.maxPrice = {
        message: "Maximum price must be greater than or equal to 0",
      };

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    if (minLat) minLat = parseInt(minLat);
    if (maxLat) maxLat = parseInt(maxLat);
    if (minLng) minLng = parseInt(minLng);
    if (maxLng) maxLng = parseInt(maxLng);

    if (minLat) query.where.lat = { [Op.gte]: minLat };
    if (maxLat) query.where.lat = { [Op.lte]: maxLat };
    if (minLat && maxLat) query.where.lat = { [Op.between]: [minLat, maxLat] };

    if (minLng) query.where.lng = { [Op.gte]: minLng };
    if (maxLng) query.where.lng = { [Op.lte]: maxLng };
    if (minLng && maxLng) query.where.lng = { [Op.between]: [minLng, maxLng] };

    if (minPrice) query.where.price = { [Op.gte]: minPrice };
    if (maxPrice) query.where.price = { [Op.lte]: maxPrice };
    if (minPrice && maxPrice)
      query.where.price = { [Op.between]: [minPrice, maxPrice] };

    if (name) query.where.name = { [Op.like]: `%${name}%` };

    let listingResults;

    if (checkInDate && checkOutDate) {
      const bookedListings = await Listing.findAll(query, {
        include: [
          {
            model: Booking,
            attributes: ["id", "startDate", "endDate"],
            where: {
              [Op.or]: [
                {
                  startDate: { [Op.lte]: checkOutDate },
                  endDate: { [Op.gte]: checkInDate },
                },
              ],
            },
          },
        ],
      });

      const bookedListingIds = bookedListings.map((listing) => listing.id);

      const availableListings = await Listing.findAll({
        where: {
          [Op.and]: [
            Sequelize.literal(query),
            {
              id: { [Op.notIn]: bookedListingIds },
              startDate: { [Op.gt]: checkOutDate },
              endDate: { [Op.lt]: checkInDate },
            },
          ],
        },
      });

      listingResults = availableListings;
    } else {
      listingResults = await Listing.findAll(query);
    }

    const payload = [];

    for (let i = 0; i < listingResults.length; i++) {
      const listing = listingResults[i];

      let previewImage = await ListingImage.findOne({
        where: {
          listingId: listing.id,
          preview: true,
        },
        attributes: ["url"],
      });

      if (previewImage) {
        previewImage = previewImage.url;
      } else {
        previewImage = null;
      }

      const totalRating = await Review.sum("stars", {
        where: {
          listingId: listing.id,
        },
      });

      const totalListings = await Review.count({
        where: {
          listingId: listing.id,
        },
      });

      const avgRatingVal = totalRating / totalListings;
      const avgRating = parseFloat(avgRatingVal);

      const listingData = {
        id: listing.id,
        ownerId: listing.ownerId,
        address: listing.address,
        city: listing.city,
        state: listing.state,
        country: listing.country,
        lat: listing.lat,
        lng: listing.lng,
        name: listing.name,
        description: listing.description,
        price: listing.price,
        createdAt: listing.createdAt,
        updatedAt: listing.updatedAt,
        avgRating,
        previewImage,
      };

      payload.push(listingData);
    }

    return res.status(200).json({
      Listings: payload,
      page,
      size,
    });
  } catch (error) {
    next(error);
  }
});

// Get all Listings owned by Current User
router.get("/current", requireAuth, async (req, res, next) => {
  try {
    const listings = await Listing.findAll({
      where: {
        ownerId: req.user.id,
      },
    });

    const payload = [];

    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];

      const totalListings = await Review.count({
        where: {
          listingId: listing.id,
        },
      });

      const totalRating = await Review.sum("stars", {
        where: { listingId: listing.id },
      });

      const avgRating = totalRating / totalListings;

      let previewImage = await ListingImage.findOne({
        where: {
          listingId: listing.id,
          preview: true,
        },
        attributes: ["url"],
      });

      previewImage = previewImage ? previewImage.url : null;

      const listingData = {
        id: listing.id,
        ownerId: listing.ownerId,
        address: listing.address,
        city: listing.city,
        state: listing.state,
        country: listing.country,
        lat: listing.lat,
        lng: listing.lng,
        name: listing.name,
        description: listing.description,
        price: listing.price,
        createdAt: listing.createdAt,
        updatedAt: listing.updatedAt,
        avgRating,
        previewImage,
      };

      payload.push(listingData);
    }

    return res.status(200).json({
      Listings: payload,
    });
  } catch (error) {
    next(error);
  }
});

// Get details of a listing from id
router.get("/:id", async (req, res, next) => {
  try {
    const listingId = req.params.id;
    const listing = await Listing.findByPk(listingId);

    if (!listing) {
      const err = new Error("The listing couldn't be found");
      err.status = 404;
      return next(err);
    }

    const numReviews = await Review.count({
      where: {
        listingId: listingId,
      },
    });

    const totalRating = await Review.sum("stars", {
      where: {
        listingId: listing.id,
      },
    });

    const totalListings = await Review.count({
      where: {
        listingId: listing.id,
      },
    });

    const avgRating = totalRating / totalListings;

    const listingImages = await ListingImage.findAll({
      where: { listingId: listingId },
      attributes: ["id", "url", "preview"],
    });

    const owner = await User.findOne({
      where: {
        id: listing.ownerId,
      },
      attributes: ["firstName", "lastName"],
    });

    const listingData = {
      id: listing.id,
      ownerId: listing.ownerId,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      country: listing.country,
      lat: listing.lat,
      lng: listing.lng,
      name: listing.name,
      description: listing.description,
      price: listing.price,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      numReviews: numReviews,
      aveStarRating: avgRating,
      ListingImages: listingImages,
      owner: owner,
    };

    return res.status(200).json(listingData);
  } catch (error) {
    next(error);
  }
});

// Create Listing
router.post("/", requireAuth, validateListing, async (req, res, next) => {
  try {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const newListing = await Listing.create({
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

    return res.status(201).json(newListing);
  } catch (error) {
    next(error);
  }
});

// Add an Image to a Listing by Listing id
router.post("/:listingId/images", requireAuth, async (req, res, next) => {
  try {
    const { url, preview } = req.body;
    const listing = await Listing.findByPk(req.params.listingId);

    if (!listing) {
      return res.status(404).json({ message: "The listing couldn't be found" });
    }

    if (listing.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const newImage = await ListingImage.create({
      listingId: listing.id,
      url,
      preview,
    });

    return res.status(200).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    });
  } catch (error) {
    next(error);
  }
});

// Edit listing
router.put("/:listingId", requireAuth, validateListing, async (req, res, next) => {
  try {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
    const listing = await Listing.findByPk(req.params.listingId);

    if (!listing) {
      return res.status(404).json({
        message: "The listing couldn't be found",
      });
    }

    if (listing.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (address) listing.address = address;
    if (city) listing.city = city;
    if (state) listing.state = state;
    if (country) listing.country = country;
    if (lat) listing.lat = lat;
    if (lng) listing.lng = lng;
    if (name) listing.name = name;
    if (description) listing.description = description;
    if (price) listing.price = price;

    await listing.save();

    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
});

// Delete Listing
router.delete("/:listingId", requireAuth, async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.listingId);

    if (!listing) {
      return res.status(404).json({ message: "The listing couldn't be found" });
    }

    if (listing.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    await listing.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});

// Get all Reviews by a Listing's id
router.get("/:listingId/reviews", async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.listingId);

    if (!listing) {
      return res.status(404).json({
        message: "The listing couldn't be found",
      });
    }

    const reviews = await Review.findAll({
      where: {
        listingId: listing.id,
      },
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: ReviewImage, attributes: ["id", "url"] },
      ],
    });

    return res.status(200).json({
      Reviews: reviews,
    });
  } catch (error) {
    next(error);
  }
});

// Create a Review for a Listing for a specific Listing id
router.post(
  "/:listingId/reviews",
  requireAuth,
  validateReview,
  async (req, res, next) => {
    try {
      const { review, stars } = req.body;
      const listing = await Listing.findByPk(req.params.listingId);

      if (!listing) {
        return res.status(404).json({
          message: "The listing couldn't be found",
        });
      }

      const oldReview = await Review.findOne({
        where: {
          listingId: listing.id,
          userId: req.user.id,
        },
      });

      if (oldReview) {
        return res.status(403).json({
          message: "User already has a review",
        });
      }

      const newReview = await Review.create({
        listingId: listing.id,
        userId: req.user.id,
        review,
        stars,
      });

      return res.status(201).json(newReview);
    } catch (error) {
      next(error);
    }
  }
);

// Get all Bookings for a listing based on the listing's id
router.get("/:listingId/bookings", requireAuth, async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.listingId);

    if (!listing) {
      return res.status(404).json({
        message: "The listing couldn't be found",
      });
    }

    if (listing.ownerId !== req.user.id) {
      const bookings = await Booking.findAll({
        where: {
          listingId: listing.id,
        },
        attributes: ["listingId", "startDate", "endDate", "id"],
      });

      return res.status(200).json(bookings);
    } else {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
  } catch (error) {
    next(error);
  }
});

// Create a Booking from a listing id
router.post("/:listingId/bookings", requireAuth, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const listing = await Listing.findByPk(req.params.listingId);

    if (!listing) {
      return res.status(404).json({ message: "The listing couldn't be found" });
    }

    if (listing.ownerId === req.user.id) {
      return res.status(400).json({
        message: "You are the owner of this listing!",
      });
    }

    const checkStartDate = await Booking.findOne({
      where: {
        listingId: listing.id,
        startDate: { [Op.lte]: startDate },
        endDate: { [Op.gte]: startDate },
      },
    });

    if (checkStartDate) {
      const err = new Error(
        "Sorry, this listing is already booked for the specific date"
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
        listingId: listing.id,
        startDate: { [Op.lte]: endDate },
        endDate: { [Op.gte]: endDate },
      },
    });

    if (checkEndDate) {
      const err = new Error(
        "Sorry, this listing is already booked for the specific date"
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
        listingId: listing.id,
        startDate: { [Op.gte]: startDate },
        endDate: { [Op.lte]: endDate },
      },
    });

    if (checkBothDate) {
      const err = new Error(
        "Sorry, this listing is already booked for the specific date"
      );
      err.error = {
        startDate: "Schedule conflict with an existing booking",
      };

      return res.status(403).json({
        message: err.message,
        errors: err.error,
      });
    }

    const newBooking = await Booking.create({
      listingId: listing.id,
      userId: req.user.id,
      startDate,
      endDate,
    });

    return res.status(200).json(newBooking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
