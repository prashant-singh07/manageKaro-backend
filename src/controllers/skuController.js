const db = require("../models/db");

const skuController = {
  addSku: async (req, res, next) => {
    const { user_id, shop_id, name, type, kind, size, ideal_selling_price } =
      req.body;
    try {
      // Validate required fields
      if (
        !user_id ||
        !shop_id ||
        !name ||
        !type ||
        !kind ||
        !size ||
        !ideal_selling_price
      ) {
        return res.status(400).json({
          message: "Missing required fields",
          description:
            "user_id, shop_id, name, type, kind, size and ideal_selling_price are required",
          data: null,
        });
      }

      const result = await db.query(
        "INSERT INTO sku (created_id, shop_id, name, type, kind, size, ideal_selling_price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [user_id, shop_id, name, type, kind, size, ideal_selling_price]
      );

      res.status(201).json({
        message: "Product added successfully",
        description: "New Product added to the shop",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating sku:", error);
      res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },
};

module.exports = skuController;
