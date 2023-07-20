const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Listing, Booking, ListingImage } = require("../../db/models");

const { Op } = require("sequelize");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: Listing,
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

    const bookingsWithPreviewImage = await Promise.all(
      bookings.map(async (booking) => {
        const listing = booking.Listing;
        let previewImage = await ListingImage.findOne({
          where: { listingId: listing.id },
        });

        if (previewImage) {
          previewImage = previewImage.url;
        } else {
          previewImage = null;
        }

        listing.dataValues.previewImage = previewImage;
        return booking;
      })
    );

    return res.status(200).json({ bookings: bookingsWithPreviewImage });
  } catch (error) {
    next(error);
  }
});

// Edit a Booking
router.put("/:bookingId", requireAuth, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const bookingToUpdate = await Booking.findByPk(req.params.bookingId);

    if (!bookingToUpdate) {
      return res.status(404).json({
        message: "The booking you are trying to edit could not be found.",
      });
    }

    if (bookingToUpdate.userId !== req.user.id) {
      return res.status(403).json({
        message: "Access Denied. You are not allowed to edit this booking.",
      });
    }

    const currentDate = new Date();
    if (bookingToUpdate.endDate <= currentDate) {
      return res.status(400).json({
        message: "Past bookings cannot be modified.",
      });
    }

    const listing = await Listing.findByPk(bookingToUpdate.listingId);

    const checkStartDate = await Booking.findOne({
      where: {
        listingId: listing.id,
        startDate: { [Op.lte]: startDate },
        endDate: { [Op.gte]: startDate },
      },
    });

    if (checkStartDate) {
      return handleBookingConflictError(
        res,
        "Start date conflicts with an existing booking."
      );
    }

    const checkEndDate = await Booking.findOne({
      where: {
        listingId: listing.id,
        startDate: { [Op.lte]: endDate },
        endDate: { [Op.gte]: endDate },
      },
    });

    if (checkEndDate) {
      return handleBookingConflictError(
        res,
        "End date conflicts with an existing booking."
      );
    }

    const checkBothDate = await Booking.findOne({
      where: {
        listingId: listing.id,
        startDate: { [Op.gte]: startDate },
        endDate: { [Op.lte]: endDate },
      },
    });

    if (checkBothDate) {
      return handleBookingConflictError(
        res,
        "Schedule conflict with an existing booking."
      );
    }

    if (startDate) bookingToUpdate.startDate = startDate;
    if (endDate) bookingToUpdate.endDate = endDate;

    await bookingToUpdate.save();

    return res.status(200).json(bookingToUpdate);
  } catch (error) {
    next(error);
  }
});

// Delete a Booking
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  try {
    const bookingToDelete = await Booking.findByPk(req.params.bookingId);

    if (!bookingToDelete) {
      return res.status(404).json({
        message: "The booking you are trying to delete could not be found.",
      });
    }

    if (bookingToDelete.userId !== req.user.id) {
      return res.status(403).json({
        message: "Access Denied. You are not allowed to delete this booking.",
      });
    }

    const currentDate = new Date();
    if (bookingToDelete.startDate <= currentDate) {
      return res.status(400).json({
        message: "Bookings that have already started cannot be deleted.",
      });
    }

    await bookingToDelete.destroy();

    return res.status(200).json({
      message: "Booking successfully deleted.",
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to handle booking conflict error
function handleBookingConflictError(res, errorMessage) {
  const err = new Error(
    "Sorry, this listing is already booked for the specified dates"
  );
  err.error = {
    startDate: errorMessage,
  };

  return res.status(403).json({
    message: err.message,
    errors: err.error,
  });
}

module.exports = router;
