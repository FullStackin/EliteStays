// backend/routes/api/users.js
const express = require("express");
const bcrypt = require("bcryptjs");

//auth
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

//valdation
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// S3 Bucket pictures
const { singleFileUpload, singleMulterUpload } = require("../../awsS3");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Sign up
router.post(
  "",
  singleMulterUpload("image"),
  validateSignup,
  async (req, res) => {
    const { password, username } = req.body;
    const profileImageUrl = req.file
      ? await singleFileUpload({ file: req.file, public: true })
      : null;
    const user = await User.signup({
      username,
      password,
      profileImageUrl,
    });

    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  }
);

module.exports = router;
