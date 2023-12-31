const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Booking, SpotImage } = require("../../db/models");
const booking = require("../../db/models/booking");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");

router.delete("/:imageId", requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const userId = req.user.id;

  const image = await SpotImage.findByPk(imageId, {
    include: { model: Spot },
  });

  if (!image) {
    return res.status(404).json({
      message: "Spot Image couldn't be found",
      statusCode: 404,
    });
  }
  const imageJSON = image.toJSON();
  if (imageJSON.Spot.ownerId !== userId) {
    return res.status(404).json({
      message: "Spot must belong to the current user",
      statusCode: 403,
    });
  }
  await image.destroy();

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
