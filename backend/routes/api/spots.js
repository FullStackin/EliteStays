const express = require('express');
const { Op } = require("sequelize");

const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage("Country is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage("Longitude is not valid"),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 49 })
        .withMessage("Name must be less than 50 characters"),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Description is required"),
    check('price')
        .exists({ checkFalsy: true })
        .isNumeric()
        .withMessage("Price per day is required"),
    handleValidationErrors
];


//get all spots
router.get('/', async (req, res) => {
    //query validation
    let { size, page, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    // console.log(size, page);
    if (page < 1) {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "page": "Page must be greater than or equal to 1"
            }
        });
    }
    if (size < 1) {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "page": "Size must be greater than or equal to 1"
            }
        });
    }
    if (Number.isNaN(maxLat)) {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "page": "Maximum latitude is invalid"
            }
        });
    }
    if (Number.isNaN(minLat)) {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "page": "Minimum latitude is invalid"
            }
        });
    }
    if (Number.isNaN(maxLng)) {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "page": "Maximum longitude is invalid"
            }
        });
    }
    if (Number.isNaN(minLng)) {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "page": "Minimum longitude is invalid"
            }
        });
    }

    if (minPrice < 0) {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "page": "Minimum price must be greater than or equal to 0"
            }
        });
    }

    if (maxPrice < 0) {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "page": "Maximum price must be greater than or equal to 0"
            }
        });
    }

    //query filter & pagination
    page = parseInt(page);
    size = parseInt(size);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(size) || size < 1 || size > 20) size = 20;
    if (page > 10) page = 10;

    let pagination = {};
    let where = {}

    pagination.limit = size;
    pagination.offset = size * (page - 1);

    if (minLat) where.lat = { [Op.gte]: minLat };
    if (maxLat) where.lat = { [Op.lte]: maxLat };
    if (minLng) where.lng = { [Op.gte]: minLng };
    if (maxLng) where.lng = { [Op.lte]: maxLng };
    if (minPrice) where.price = { [Op.gte]: minPrice };
    if (maxPrice) where.price = { [Op.lte]: maxPrice };


    const spots = await Spot.findAll({
        where,
        ...pagination,
        include: [
            { model: SpotImage },
            { model: Review },
        ],
    });
    const spotList = [];

    spots.forEach(spot => {
        spotList.push(spot.toJSON());
    });

    spotList.forEach(spot => {
        if (!spot.SpotImages.length) spot.previewImage = 'No preview image found';
        else {
            spot.previewImage = spot.SpotImages[0].url;
            spot.preview = true;
        }

        delete spot.SpotImages;
    })

    //calc avg rating given
    spotList.forEach(spot => {
        let count = 0;
        let sum = 0;
        spot.Reviews.forEach(review => {
            count++;
            sum += review.stars;
        })

        spot.avgRating = sum / count;

        delete spot.Reviews;
    })
    res.json(spotList)
});

//get all current user's spots
router.get('/current', requireAuth, async (req, res) => {
    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        include: [
            { model: SpotImage },
            { model: Review }
        ]
    });

    let spotList = [];
    spots.forEach(spot => {
        spotList.push(spot.toJSON());
    });


    spotList.forEach(spot => {
        if (!spot.SpotImages.length) spot.previewImage = 'No preview image found';
        else {
            spot.previewImage = spot.SpotImages[0].url;
            spot.preview = true;
        }

        delete spot.SpotImages;
    })

    //calc avg rating given
    spotList.forEach(spot => {
        let count = 0;
        let sum = 0;
        spot.Reviews.forEach(review => {
            count++;
            sum += review.stars;
        })

        spot.avgRating = sum / count;

        delete spot.Reviews;
    })
    res.json({ Spots: spotList })

});

router.get('/:spotid', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotid, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview'],
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName'],
            },
            {
                model: Review
            }
        ]
    });

    if (!spot) {
        res.status(404).json({ message: 'Spot couldn\'t be found' })
    }

    const spotJSON = spot.toJSON();
    spotJSON.numReviews = spotJSON.Reviews.length;

    let sum = 0;
    let count = 0;
    spotJSON.Reviews.forEach(review => {
        count++;
        sum += review.stars;
    })
    spotJSON.avgStarRating = sum / count;

    delete spotJSON.Reviews;

    res.json(spotJSON);

});

router.post('/:spotId/reviews', async (req, res) => {
    const { review, stars } = req.body;
    const userId = req.user.id;
    const spotId = req.params.spotId;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const existing = await Review.findAll({ where: { userId: userId, spotId: spotId } });

    if (existing.length) {
        return res.status(403).json({ message: "User already has a review for this spot" });
    }

    const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars
    })

    return res.status(201).json(newReview);

});

router.get('/:spotId/reviews', async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

    const reviews = await Review.findAll({
        where: { spotId: req.params.spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })

    return res.status(200).json({ Reviews: reviews })
});

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spotId = req.params.spotId;

    const spot = await Spot.findByPk(spotId, {
        attributes: ['ownerId'],
        include: [{
            model: Booking,
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }]
        }]
    })

    if (!spot) {
        return res.status(404).json({ message: "Spot could't be found" });
    }

    const spotJson = spot.toJSON();
    if (spot.ownerId === userId) {
        delete spotJson.ownerId;
        return res.status(200).json(spotJson);
    }
    else {
        spotJson.Bookings.forEach(booking => {
            delete booking.User;
            delete booking.id;
            delete booking.userId;
            delete booking.createdAt;
            delete booking.updatedAt;
        })
    }
    delete spotJson.ownerId;

    return res.status(200).json(spotJson);

});

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spotId = req.params.spotId;
    const { startDate, endDate } = req.body;

    const spot = await Spot.findByPk(spotId, {
        include: [{ model: Booking }]
    });

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    const spotJson = spot.toJSON();
    if (spotJson.ownerId === userId) {
        return res.status(403).json({
            message: "Spot belongs to you",
            statusCode: 403
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
    });

    const booking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate,
    })

    return res.status(200).json(booking);
})


router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
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
        price
    })
    res.json(spot);
});

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404).json({ "message": "Spot couldn't be found" });
    }

    const img = await SpotImage.create({ spotId, url, preview });
    const imgJSON = img.toJSON();
    res.json(imgJSON);

});

router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: "404"
        });
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: "403"
        })
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
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const spot = await Spot.findByPk(spotId);
    // console.log('spot in delete', spot);

    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        });
    }
    console.log('spot owner', spot.ownerId);
    console.log('userId', userId);
    if (spot.ownerId != userId) {
        return res.status(403).json({
            "message": "Spot must belong to you",
            "statusCode": 403
        })
    }

    await spot.destroy();
    return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
})


//test router setup
router.get('/test', function (req, res) {
    res.send('endpoint hit');
});

module.exports = router;
