const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");

// Auth routes
router.post("/get-all-sales", saleController.getAllSales);
router.post("/create-sale-order", saleController.createSaleOrder);

module.exports = router;
