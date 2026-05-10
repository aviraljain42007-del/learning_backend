const redisClient = require("../config/redis");

const rateLimit = async (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const key = `rate_limit:${ip}`;
  const limit = 100;
  const windowInSeconds = 15 * 60; // 15 minutes

  try {
    const current = await redisClient.incr(key);
    if (current === 1) {
      await redisClient.expire(key, windowInSeconds);
    }
    
    if (current > limit) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later."
      });
    }
    next();
  } catch (error) {
    console.error("Redis rate limiter error:", error);
    // Fallback if Redis fails, allow request
    next();
  }
};

module.exports = rateLimit;
