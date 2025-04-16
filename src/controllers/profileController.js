const db = require("../models/db");

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
      gst_number,
      profile_image,
    } = req.body;
    try {
      // Validate required fields
      if (!user_id || !name) {
        return res.status(400).json({
          message: "Missing required fields",
          description: "user_id and name are required",
          data: null,
        });
      }

      const result = await db.query(
        `UPDATE users 
         SET email_id = COALESCE($1, email_id),
             name = COALESCE($2, name),
             gender = COALESCE($3, gender),
             dob = COALESCE($4, dob),
             address = COALESCE($5, address),
             role = COALESCE($6, role),
             gst_number = COALESCE($7, gst_number),
             profile_image = COALESCE($8, profile_image),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [
          email_id,
          name,
          gender,
          dob,
          address,
          role,
          gst_number,
          profile_image,
          user_id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "User not found",
          description: "No user exists with the provided user_id",
          data: null,
        });
      }

      return res.status(200).json({
        message: "Profile updated successfully",
        description: "User profile has been updated",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
        message: "Server Error",
        description: error.message,
        data: null,
      });
    }
  },
};

module.exports = profileController;
