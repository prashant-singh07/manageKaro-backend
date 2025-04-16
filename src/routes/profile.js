const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// Profile routes
router.post("/update-profile", profileController.updateProfile);

module.exports = router;
