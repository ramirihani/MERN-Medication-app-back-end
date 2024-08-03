const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const authorizeMiddleware = (role) => async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== role) {
    return res.status(403).json({ msg: `Access denied, only ${role} allowed` });
  }
  next();
};

module.exports = {
  authMiddleware,
  authorizeMiddleware,
};
