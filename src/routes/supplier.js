const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");

// Auth routes
router.post("/addSupplier", supplierController.addSupplier);

module.exports = router;
