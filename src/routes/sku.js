const express = require("express");
const router = express.Router();
const skuController = require("../controllers/skuController");

// Supplier routes
router.post("/addSku", skuController.addSku);

module.exports = router;
