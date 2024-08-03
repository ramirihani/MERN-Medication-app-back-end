const express = require("express");
const router = express.Router();
const {
  createMedication,
  getMedications,
  getMedicationById,
  updateMedication,
  deleteMedication,
} = require("../controllers/medications");
const {
  authMiddleware,
  authorizeMiddleware,
} = require("../middlewares/authMiddleware");

// @route POST api/medications
// @desc Create medication
router.post(
  "/",
  authMiddleware,
  authorizeMiddleware("admin"),
  createMedication
);

// @route GET api/medications
// @desc Get all medications
router.get("/", authMiddleware, getMedications);

// @route GET api/medications/:id
// @desc Get medication by ID
router.get("/:id", getMedicationById);

// @route PUT api/medications/:id
// @desc Update medication by ID
router.put(
  "/:id",
  authMiddleware,
  authorizeMiddleware("admin"),
  updateMedication
);

// @route DELETE api/medications/:id
// @desc Soft delete medication by ID
router.delete(
  "/:id",
  authMiddleware,
  authorizeMiddleware("admin"),
  deleteMedication
);

module.exports = router;
