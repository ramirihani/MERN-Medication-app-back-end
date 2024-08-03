const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authAdmin = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied, only admin allowed" });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
