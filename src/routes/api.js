const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

// Define your routes here
router.get("/items", mainController.getAllItems);
router.post("/items", mainController.createItem);
// router.post("/register", mainController.authController.register);
module.exports = router;
