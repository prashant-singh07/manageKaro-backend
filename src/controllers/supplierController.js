const db = require("../models/db");
const supplierQueries = require("../queries/supplierQueries");

const supplierController = {
  addSupplier: async (req, res, next) => {
    const { user_id, shop_id, name, mobile, address, email, gst } = req.body;
    try {
      // Validate required fields
      if (!user_id || !shop_id || !name || !mobile || !address) {
        return res.status(400).json({
          message: "Missing required fields",
          description:
            "user_id, shop_id, name, mobile and address are required",
          data: null,
        });
      }

      const result = await db.query(
        "INSERT INTO suppliers (created_id, shop_id, name, mobile, address, email_id, gst) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [user_id, shop_id, name, mobile, address, email, gst]
      );

      res.status(201).json({
        message: "Supplier added successfully",
        description: "New supplier has been created",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating supplier:", error);
      res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },

  getAllSuppliers: async (req, res, next) => {
    try {
      const { user_id, shop_id } = req.body;

      // Validate required fields
      if (!shop_id || !user_id) {
        return res.status(400).json({
          message: "Missing required fields",
          description: "user_id or shop_id is required",
          data: null,
        });
      }

      const allSuppliers = await supplierQueries.getSuppliersByUserAndShop(
        user_id,
        shop_id
      );

      if (!allSuppliers) {
        return res.status(404).json({
          message: "No suppliers found",
          description: "No suppliers found for the user and shop",
          data: null,
        });
      }
      return res.status(200).json({
        message: "Suppliers retrieved successfully",
        description: "List of all suppliers for the shop",
        data: allSuppliers,
      });
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      return res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },
};

module.exports = supplierController;
