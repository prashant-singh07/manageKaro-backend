const express = require("express");
const router = express.Router();
const skuController = require("../controllers/skuController");

// Supplier routes
router.post("/add-new-sku", skuController.addNewSku);

router.post("/get-all-skus", skuController.getAllSkus);

module.exports = router;
