const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");

// Auth routes
router.post("/addSales", saleController.addSales);
router.get("/getSales", saleController.getSales);
module.exports = router;
