const Url = require("../models/Url");
const crypto = require("crypto");
const ApiError = require("../utils/errorhandler");

class UrlService {
  // Generate a cryptographically secure random string (base64url)
  generateShortId(length = 6) {
    return crypto.randomBytes(length).toString("base64url").substring(0, length);
  }

  // Create short URL with collision handling retry loop
  async createShortUrl(originalUrl) {
    if (!originalUrl || !originalUrl.startsWith("http")) {
      throw new ApiError(400, "Please provide a valid URL starting with http/https");
    }

    const MAX_RETRIES = 5;
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const shortId = this.generateShortId();
        
        const newUrl = await Url.create({
          originalUrl,
          shortId,
        });

        return newUrl;
      } catch (error) {
        // 11000 is MongoDB's duplicate key error code
        if (error.code === 11000) {
          retries++;
          console.log(`Collision detected for shortId. Retrying... (${retries}/${MAX_RETRIES})`);
        } else {
          throw error;
        }
      }
    }

    throw new ApiError(500, "Failed to generate a unique short URL. Please try again.");
  }

  // Get original URL by shortId and track click
  async getOriginalUrl(shortId) {
    if (!shortId) {
      throw new ApiError(400, "Short ID is required");
    }

    const urlDoc = await Url.findOneAndUpdate(
      { shortId },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!urlDoc) {
      throw new ApiError(404, "Short URL not found");
    }

    return urlDoc.originalUrl;
  }
}

module.exports = new UrlService();
