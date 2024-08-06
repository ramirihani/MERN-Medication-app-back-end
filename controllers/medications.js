const fs = require("fs"); // Add this line
const path = require("path");
const Medication = require("../models/Medication");
const mongoose = require("mongoose");

// Create Medication
exports.createMedication = async (req, res) => {
  try {
    const { name, description, quantity, image } = req.body;
    let imagePath = null;

    if (image) {
      // Decode base64 string and save it to the server
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const filename = `${Date.now()}.png`;
      const filePath = path.join(__dirname, "../uploads", filename);

      fs.writeFileSync(filePath, buffer);
      imagePath = `uploads/${filename}`;
    }

    const newMedication = new Medication({
      name,
      description,
      image: imagePath,
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
  const { name, description, quantity } = req.body;
  let image = null;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid medication ID" });
  }

  try {
    // Find medication by ID
    const medication = await Medication.findById(id);

    if (!medication) {
      return res.status(404).json({ msg: "Medication not found" });
    }

    // Update fields
    medication.name = name || medication.name;
    medication.description = description || medication.description;
    medication.quantity = quantity || medication.quantity;

    if (req.file) {
      image = req.file.path;
      medication.image = image;
    }

    await medication.save();
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
