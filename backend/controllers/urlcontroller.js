const urlService = require("../services/urlService");
const asyncHandler = require("../utils/asynchandler");

// Generate a short URL
exports.shortenUrl = asyncHandler(async (req, res) => {
  const { originalUrl } = req.body;

  const newUrl = await urlService.createShortUrl(originalUrl);

  const shortUrl = `${req.protocol}://${req.get("host")}/api/s/${newUrl.shortId}`;

  res.status(201).json({
    success: true,
    message: "Short URL generated successfully",
    data: {
      originalUrl: newUrl.originalUrl,
      shortId: newUrl.shortId,
      shortUrl,
      clicks: newUrl.clicks,
    },
  });
});

// Redirect short URL to original URL
exports.redirectUrl = asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  const originalUrl = await urlService.getOriginalUrl(shortId);

  res.redirect(originalUrl);
});
