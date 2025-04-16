const profileQueries = require("../queries/profileQueries");

const profileController = {
  updateProfile: async (req, res, next) => {
    const {
      user_id,
      email_id,
      name,
      gender,
      dob,
      address,
      role,
      profile_image,
    } = req.body;

    try {
      // Validate required fields
      if (!user_id || !name) {
        return res.status(400).json({
          message: "Missing required fields",
          description: "Name is required.",
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

      // Update profile
      const updatedUser = await profileQueries.updateUserProfile(user_id, {
        email_id,
        name,
        gender,
        dob,
        address,
        role,
        profile_image,
      });

      if (!updatedUser) {
        return res.status(400).json({
          message: "Profile update failed",
          description: "Failed to update profile",
          data: null,
        });
      }

      const { id, password, created_at, updated_at, ...rest } = updatedUser;
      const { shop_id, name: user_name } = rest;
      const isProfileComplete = user_name?.trim()?.length > 0;
      const isShopLinked = shop_id && shop_id.length > 0;
      return res.status(200).json({
        message: "Profile updated successfully",
        description: "User profile has been updated",
        data: {
          user_id: id,
          is_profile_completed: isProfileComplete,
          is_shop_linked: isShopLinked,
          ...rest,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);

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

module.exports = profileController;
