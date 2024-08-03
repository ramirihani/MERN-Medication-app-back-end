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

// Get All Medications
exports.getMedications = async (req, res) => {
  try {
    const medications = await Medication.find();
    res.status(200).json(medications);
  } catch (err) {
    res.status(500).json({ msg: err.message });
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

// Soft Delete Medication
exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication)
      return res.status(404).json({ msg: "Medication not found" });
    medication.deleted = true; // Add a deleted flag if you are marking for soft delete
    await medication.save();
    res.status(200).json({ msg: "Medication deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
