const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ApiError = require("../utils/errorhandler");
const googleClient = require("../config/googleClient");

// Helper: generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;

  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET
    

  if (!accessTokenSecret || !refreshTokenSecret) {
    throw new ApiError(500, "JWT secrets are missing");
  }

  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    accessTokenSecret,
    {
      expiresIn: process.env.JWT_EXPIRE || "15m",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    refreshTokenSecret,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
    }
  );

  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  return {
    accessToken,
    refreshToken,
  };
};

// Controller: Google Login
exports.googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      throw new ApiError(400, "Google credential is required");
    }

    // 1. Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // 2. Extract Google user info
    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;
    const emailVerified = payload.email_verified;

    if (!email || !emailVerified) {
      throw new ApiError(400, "Google email is not verified");
    }

    // 3. Check if user already exists
    let user = await User.findOne({ email }).select("+refreshToken");

    if (!user) {
      // 4. Create new Google user
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        authProvider: "google",
        isEmailVerified: true,
      });
    } else {
      // 5. Existing user: link Google account details
      if (!user.googleId) {
        user.googleId = googleId;
      }

      if (!user.avatar && picture) {
        user.avatar = picture;
      }

      user.isEmailVerified = true;

      await user.save({
        validateBeforeSave: false,
      });
    }

    // 6. Generate app access + refresh tokens
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    // 7. Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    // 8. Send cookies + response
    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        success: true,
        message: "Google login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          authProvider: user.authProvider,
          isEmailVerified: user.isEmailVerified,
        },
      });
  } catch (error) {
    next(error);
  }
};