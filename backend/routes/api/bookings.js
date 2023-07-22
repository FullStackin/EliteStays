const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { requireAuth } = require('../../utils/auth')
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');

//current user bookings
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
        where: {
            userId,
        },
        include: {
            model: Spot,
            include: { model: SpotImage },
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
        },
    });

    const bookingList = [];
    bookings.forEach(booking => {
        bookingList.push(booking.toJSON());
    });

    bookingList.forEach(booking => {
        if (!booking.Spot.SpotImages.length) booking.Spot.previewImage = 'No preview image found';
        else {
            booking.Spot.previewImage = booking.Spot.SpotImages[0].url;
        }

        delete booking.Spot.SpotImages;
    })

    res.json({ Bookings: bookingList });
});


//edit booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const bookingId = req.params.bookingId;
    const { startDate, endDate } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
        res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }

    const bookingJson = booking.toJSON();
    if (bookingJson.userId !== userId) {
        res.status(403).json({
            "message": "Forbidden",
            "statusCode": 403,
        })
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();


    if (start >= end) {
        res.status(403).json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": [
                "endDate cannot come before startDate"
            ]
        })
    }

    if (now >= start || now >= end) {
        res.status(403).json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        })
    }

    const spot = await Spot.findByPk(bookingJson.spotId, {
        include: [
            { model: Booking }
        ]
    })
    const spotJson = spot.toJSON();
    spotJson.Bookings.forEach(booking => {
        const existingStart = booking.startDate.getTime();
        const existingEnd = booking.endDate.getTime();

        if (start >= existingStart && start <= existingEnd) {
            res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "errors": { "startDate": "Start date conflicts with an existing booking" },
                "statusCode": 403
            })
        }
        if (end >= existingStart && end <= existingEnd) {
            res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "errors": { "endDate": "End date conflicts with an existing booking" },
                "statusCode": 403
            })
        }
    })

    booking.startDate = startDate;
    booking.endDate = endDate;

    await booking.save();

    return res.status(200).json(booking);
});

//delete booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByPk(bookingId, {
        include: { model: Spot }
    });

    if (!booking) {
        res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }
    if (booking.userId != userId) {
        return res.status(403).json({
            "message": "Booking must belong to you",
            "statusCode": 403
        })
    }

    const bookingJSON = booking.toJSON();

    const start = new Date(bookingJSON.startDate).getTime();
    const now = new Date().getTime();

    if (now >= start) {
        res.status(403).json({
            "message": "Bookings that have been started can't be deleted",
            "statusCode": 403
        })
    };

    await booking.destroy();

    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })


})

//test router setup
router.get('/test', function (req, res) {
    res.send('endpoint hit');
});

module.exports = router;
