const express = require("express");
const { shortenUrl, redirectUrl } = require("../controllers/urlcontroller");

const router = express.Router();

// Route to generate a short URL
// Add auth middleware here if you want to restrict this to logged-in users
router.post("/shorten", shortenUrl);

// Route to handle redirection
router.get("/:shortId", redirectUrl);

module.exports = router;
