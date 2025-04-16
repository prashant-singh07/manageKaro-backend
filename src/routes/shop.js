const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

// Auth routes
router.post("/update-shop", shopController.updateShop);

module.exports = router;
