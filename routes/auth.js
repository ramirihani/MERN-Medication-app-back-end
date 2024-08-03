const express = require("express");
const { register, login } = require("../controllers/auth");
const router = express.Router();

// @route POST api/auth/register
// @desc Register user
router.post("/register", register);

// @route POST api/auth/login
// @desc Login user
router.post("/login", login);

module.exports = router;
