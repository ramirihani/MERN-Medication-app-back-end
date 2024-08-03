const Medication = require("../models/Medication");

// Get all medications
exports.getMedications = async (req, res) => {
  try {
    const medications = await Medication.find();
    res.json(medications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Add a new medication
exports.addMedication = async (req, res) => {
  const { name, description, image, quantity } = req.body;
  try {
    const newMedication = new Medication({
      name,
      description,
      image,
      quantity,
    });
    const medication = await newMedication.save();
    res.json(medication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Like a medication
exports.likeMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    medication.likes.push({ userId: req.body.userId });
    await medication.save();
    res.json(medication.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Add a comment to a medication
exports.addComment = async (req, res) => {
  const { userId, comment } = req.body;
  try {
    const medication = await Medication.findById(req.params.id);
    medication.comments.push({ userId, comment });
    await medication.save();
    res.json(medication.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
