const express = require("express");

const router = express.Router();
const { Op } = require("sequelize");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, SpotImage, User, Booking } = require("../../db/models");

const booking = require("../../db/models/booking");

//current user bookings
router.get("/current", requireAuth, async (req, res, next) => {
  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
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
    ],
  });

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];
    const spot = booking.Spot;

    let previewImage = await SpotImage.findOne({ where: { spotId: spot.id } });

    if (previewImage) {
      previewImage = previewImage.url;
    } else {
      previewImage = null;
    }

    spot.dataValues.previewImage = previewImage;
  }

  return res.status(200).json({ Bookings: bookings });
});

//edit booking
router.put("/:bookingId", requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;

  const bookingToUpdate = await Booking.findByPk(req.params.bookingId);

  if (!bookingToUpdate) {
    return res.status(404).json({
      message:
        "I regret to inform you that the requested booking could not be located.",
    });
  }

  if (bookingToUpdate.userId !== req.user.id) {
    return res.status(403).json({
      message:
        "I apologize, but you do not have the necessary permissions to proceed.",
    });
  }

  const currentDate = new Date();

  if (bookingToUpdate.endDate <= currentDate) {
    return res.status(400).json({
      message: "I'm afraid past bookings cannot be modified.",
    });
  }

  const spot = await Spot.findOne({
    where: {
      id: bookingToUpdate.spotId,
    },
  });

  const checkStartDate = await Booking.findOne({
    where: {
      spotId: spot.id,
      startDate: { [Op.lte]: startDate },
      endDate: { [Op.gte]: startDate },
    },
  });

  if (checkStartDate) {
    const err = new Error(
      "My sincere apologies, but this spot is already booked for the specified dates."
    );
    err.error = {
      startDate:
        "I regret to inform you that your desired start date conflicts with an existing booking.",
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
      "My sincere apologies, but this spot is already booked for the specified dates."
    );
    err.error = {
      startDate:
        "I regret to inform you that your desired end date conflicts with an existing booking.",
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
      "My sincere apologies, but this spot is already booked for the specified dates."
    );
    err.error = {
      startDate:
        "I regret to inform you that your desired schedule conflicts with an existing booking.",
    };

    return res.status(403).json({
      message: err.message,
      errors: err.error,
    });
  }

  if (startDate) bookingToUpdate.startDate = startDate;
  if (endDate) bookingToUpdate.endDate = endDate;

  await bookingToUpdate.save();

  return res.status(200).json(bookingToUpdate);
});

//delete booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    try {
        const bookingToDelete = await Booking.findByPk(req.params.bookingId);

        if (!bookingToDelete) {
            return res.status(404).json({
                message: "The requested booking could not be located."
            });
        }

        if (bookingToDelete.userId !== req.user.id) {
            return res.status(403).json({
                message: "Access forbidden."
            });
        }

        const currentDate = new Date();
        if (bookingToDelete.startDate <= currentDate) {
            return res.status(400).json({
                message: "Deletion of bookings that have commenced is not permitted."
            });
        }

        await bookingToDelete.destroy();

        return res.status(200).json({
            message: 'Deletion successful.'
        });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
