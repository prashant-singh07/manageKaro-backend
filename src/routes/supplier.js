const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");

// Auth routes
// router.post("/addSupplier", supplierController.addSupplier);
router.post("/get-all-suppliers", supplierController.getAllSuppliers);
router.post("/add-supplier", supplierController.addSupplier);

module.exports = router;
