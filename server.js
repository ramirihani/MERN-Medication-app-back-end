require("dotenv").config(); // Ensure this line is present at the top

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const medicationRoutes = require("./routes/medications");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
