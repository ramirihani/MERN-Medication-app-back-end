const express = require("express");
const {
  getMedications,
  addMedication,
  likeMedication,
  addComment,
} = require("../controllers/medications");
const { authAdmin } = require("../middlewares/auth");
const { authorize } = require("../middlewares/authorize");
const router = express.Router();

// @route GET api/medications
// @desc Get all medications
router.get("/", getMedications);

// @route POST api/medications
// @desc Add a new medication (admin only)
router.post("/", authAdmin, authorize, addMedication);

// @route POST api/medications/like/:id
// @desc Like a medication
router.post("/like/:id", likeMedication);

// @route POST api/medications/comment/:id
// @desc Add a comment to a medication
router.post("/comment/:id", addComment);

module.exports = router;
