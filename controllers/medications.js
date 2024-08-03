const Medication = require("../models/Medication");
const mongoose = require("mongoose");
// Create Medication
exports.createMedication = async (req, res) => {
  try {
    const { name, description, image, quantity } = req.body;
    const newMedication = new Medication({
      name,
      description,
      image,
      quantity,
    });
    await newMedication.save();
    res.status(201).json(newMedication);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get All Medications based on the connected user
exports.getMedications = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      query.deleted = false;
    }
    const medications = await Medication.find(query);
    res.json(medications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get Medication by ID
exports.getMedicationById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid medication ID" });
  }

  try {
    const medication = await Medication.findById(id);
    if (!medication) {
      return res.status(404).json({ msg: "Medication not found" });
    }
    res.json(medication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update Medication
exports.updateMedication = async (req, res) => {
  const { id } = req.params;
  const { name, description, image, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid medication ID" });
  }

  try {
    // Find medication by ID and update
    const medication = await Medication.findByIdAndUpdate(
      id,
      { name, description, image, quantity },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!medication) {
      return res.status(404).json({ msg: "Medication not found" });
    }

    res.json(medication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Soft delete medication by ID
exports.deleteMedication = async (req, res) => {
  const { id } = req.params;

  try {
    const medication = await Medication.findById(id);
    if (!medication) {
      return res.status(404).json({ msg: "Medication not found" });
    }

    medication.deleted = true; // Mark as deleted
    await medication.save();
    res.json({ msg: "Medication removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
