const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

// Purchase routes
router.post("/create-purchase-order", purchaseController.createPurchaseOrder);
router.post("/get-all-purchase", purchaseController.getAllPurchase);
router.post("/get-purchase-details", purchaseController.getPurchaseDetails);
module.exports = router;
