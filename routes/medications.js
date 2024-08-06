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
const upload = require("../multerConfig");

// @route POST api/medications
// @desc Create medication
router.post(
  "/",
  authMiddleware,
  authorizeMiddleware("admin"),
  upload.single("image"), // Middleware to handle file upload
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
  upload.single("image"), // Middleware to handle file upload
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
