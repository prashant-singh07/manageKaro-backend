const profileQueries = require("../queries/profileQueries");
const shopQueries = require("../queries/shopQueries");

const shopController = {
  updateShop: async (req, res, next) => {
    const {
      user_id,
      name,
      address,
      pincode,
      mobile,
      business_type,
      gst_number,
    } = req.body;

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

      // Check if user exists
      const existingUser = await profileQueries.getUserById(user_id);
      if (!existingUser) {
        return res.status(404).json({
          message: "User not found",
          description: "No user exists with the provided user_id",
          data: null,
        });
      }

      // Check if shop already exists
      // const existingShop = await shopQueries.getShopById(shop_id);
      // if (existingShop) {
      //   return res.status(400).json({
      //     message: "Shop already exists",
      //     description: "A shop already exists with the provided user_id",
      //     data: null,
      //   });
      // }

      // Create new shop
      const newShop = await shopQueries.createShop({
        name,
        address,
        pincode,
        mobile,
        business_type,
        gst_number,
        created_id: user_id,
        updated_id: user_id,
      });

      // Update user's shop_id array
      const profileShopIds = await profileQueries.updateUserShopIds(
        user_id,
        newShop.id
      );

      if (!newShop || !profileShopIds) {
        return res.status(400).json({
          message: "Shop not created",
          description: "Shop not created",
          data: null,
        });
      }

      const { id, created_id, created_at, updated_at, updated_id, ...rest } =
        newShop;
      return res.status(200).json({
        message: "Shop updated successfully",
        description: "Shop has been updated",
        data: { shop_id: id, ...rest },
      });
    } catch (error) {
      console.error("Error updating shop:", error);

      // Handle Supabase specific errors
      if (error.code === "PGRST116") {
        return res.status(404).json({
          message: "User not found",
          description: "No user exists with the provided user_id",
          data: null,
        });
      }

      return res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },
};

module.exports = shopController;
