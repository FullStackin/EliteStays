const express = require('express');
const router = express.Router();

const { Op } = require("sequelize");
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

//get all reviews of user

router.get('/current', requireAuth, async (req, res) => {
    const reviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                include: { model: SpotImage },
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const reviewList = [];

    reviews.forEach(review => {
        reviewList.push(review.toJSON())
    });

    reviewList.forEach(review => {
        if (!review.Spot.SpotImages.length) review.spot.previewImage = 'No preview image found';
        else {
            review.Spot.previewImage = review.Spot.SpotImages[0].url;
        }

        delete review.Spot.SpotImages;
    })

    return res.json({ Reviews: reviewList });

});



//add review image
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const reviewId = req.params.reviewId;
    const url = req.body.url;
    const review = await Review.findByPk(reviewId, {
        include: [{ model: ReviewImage }]
    });

    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    if (req.user.id !== review.userId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    if (review.ReviewImages.length >= 10) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached",
            statusCode: 403
        })
    }

    const img = await ReviewImage.create({ reviewId, url });
    const imgJSON = img.toJSON();

    res.json(imgJSON);

});

//edit a review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const { review, stars } = req.body;
    const userId = req.user.id;
    const reviewId = req.params.reviewId;

    const edit = await Review.findByPk(reviewId);
    if (!edit) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    const reviewJSON = edit.toJSON();
    if (reviewJSON.userId !== userId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    edit.review = review;
    edit.stars = stars;
    await edit.save();

    return res.status(200).json(edit);
})

//delete review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);
    if (!review) {
        res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }

    if (review.userId != userId) {
        return res.status(403).json({
            "message": "review must belong to you",
            "statusCode": 403
        })
    }

    await review.destroy();
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })

})


//test router setup
router.get('/test', function (req, res) {
    res.send('endpoint hit');
});

//

module.exports = router;
