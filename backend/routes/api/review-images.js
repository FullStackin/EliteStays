const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//delete review img

router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = req.params.imageId;
    const userId = req.user.id;

    const image = await ReviewImage.findByPk(imageId, {
        include: { model: Review }
    });

    if (!image) {
        return res.status(404).json({
            "message": "Review Image couldn't be found",
            "statusCode": 404
        })
    }
    const imageJSON = image.toJSON();
    if (imageJSON.Review.userId !== userId) {
        return res.status(404).json({
            "message": "Review must belong to the current user",
            "statusCode": 403
        })
    }
    await image.destroy();

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
