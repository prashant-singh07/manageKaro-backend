const db = require("../models/db");

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
};

module.exports = supplierController;
