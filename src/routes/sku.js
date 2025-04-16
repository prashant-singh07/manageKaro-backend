const express = require("express");
const router = express.Router();
const skuController = require("../controllers/skuController");

// Supplier routes
router.post("/addSku", skuController.addSku);

router.get("/", skuController.getAllSkus);
router.get("/:sku_id", skuController.getSkuById);

module.exports = router;
