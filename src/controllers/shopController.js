const db = require("../models/db");

const shopController = {
  updateShop: async (req, res, next) => {
    const { user_id, name, address, pincode, mobile, business_type } = req.body;
    try {
      // Validate required fields
      if (
        !user_id ||
        !name ||
        !address ||
        !pincode ||
        !mobile ||
        !business_type
      ) {
        return res.status(400).json({
          message: "Missing required fields",
          description:
            "user_id, name, address, pincode, mobile, business_type are required",
          data: null,
        });
      }

      const result = await db.query(
        `INSERT INTO shops (name, address, pincode, mobile, business_type, created_id) 
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, address, pincode, mobile, business_type, user_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "User not found",
          description: "No user exists with the provided user_id",
          data: null,
        });
      }

      // Update user's shops_ids array
      await db.query(
        `UPDATE users 
         SET shop_id = array_append(shop_id, $1)
         WHERE id = $2`,
        [result.rows[0].id, user_id]
      );

      return res.status(200).json({
        message: "Shop updated successfully",
        description: "Shop has been updated",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating shop:", error);
      return res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },
};

module.exports = shopController;
