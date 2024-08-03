const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register User
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    console.log("Registering user with email:", email); // Debug log

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists with email:", email); // Debug log
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      role: role || "user", // Default role is 'user'
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    console.log("Hashed password:", user.password); // Debug log

    // Save user
    await user.save();
    console.log("User registered successfully:", user); // Debug log

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Logging in user with email:", email); // Debug log

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email); // Debug log
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check password
    console.log("Stored hashed password:", user.password); // Debug log
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match status:", isMatch); // Debug log
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
