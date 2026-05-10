const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.checkuser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // Token missing?
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please login"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next();
  };
};
