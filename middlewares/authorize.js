const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to check if the user is an admin or superadmin
exports.authorize = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    const user = await User.findById(req.user.id);
    if (user.role !== "admin" && user.role !== "superadmin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
