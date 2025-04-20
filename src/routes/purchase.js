const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

// Purchase routes
router.post("/create-purchase-order", purchaseController.createPurchaseOrder);
router.get("/getPurchase", purchaseController.getPurchase);
module.exports = router;
