const supabase = require("../config/supabase");

const profileQueries = {
  async updateUserProfile(userId, profileData) {
    const { email_id, name, gender, dob, address, role, profile_image } =
      profileData;

    // Prepare update data with only defined values
    const updateData = {
      ...(email_id !== undefined && { email_id }),
      ...(name !== undefined && { name }),
      ...(gender !== undefined && { gender }),
      ...(dob !== undefined && { dob }),
      ...(address !== undefined && { address }),
      ...(role !== undefined && { role }),
      ...(profile_image !== undefined && { profile_image }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.log("Error updateUserProfile", error);
      return null;
    }
    console.log("Data updateUserProfile", data);
    return data;
  },

  async getUserById(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.log("Error getUserById", error);
      return null;
    }
    console.log("Data getUserById", data);
    return data;
  },

  async updateUserShopIds(userId, shopId) {
    // First get the current shop_id array
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("shop_id")
      .eq("id", userId)
      .single();

    if (userError) {
      console.log("userError", userError);

      return null;
    }

    // Create new shop_id array or append to existing one
    const newShopIds = user.shop_id ? [...user.shop_id, shopId] : [shopId];

    // Update the user with new shop_id array
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ shop_id: newShopIds })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.log("Error updateUserShopIds", updateError);
      return null;
    }
    console.log("Data updateUserShopIds", updatedUser);
    return updatedUser;
  },
};

module.exports = profileQueries;
