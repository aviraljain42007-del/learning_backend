const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.checkuser = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    // Token missing?
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please login"
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password").lean();

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // Try to use the refresh token
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({
            success: false,
            message: "Session expired - Please login again"
          });
        }

        try {
          const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
          const user = await User.findById(decodedRefresh.id).select("+refreshToken").lean();

          if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
              success: false,
              message: "Invalid session - Please login again"
            });
          }

          // Generate new access token
          const newAccessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || "15m" }
          );

          // Set the new access token in the cookie
          res.cookie("accessToken", newAccessToken, {
            httpOnly: false, // adjust based on your original cookie settings
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
          });

          req.user = user;
          return next();
        } catch (refreshError) {
          return res.status(401).json({
            success: false,
            message: "Session expired - Please login again"
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
