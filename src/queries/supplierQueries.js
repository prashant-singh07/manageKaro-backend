const supabase = require("../config/supabase");

const supplierQueries = {
  async getSuppliersByUserAndShop(userId, shopId) {
    console.log("userId", userId);
    console.log("shopId", shopId);
    const { data, error } = await supabase
      .from("suppliers")
      // .select("*")
      .select("id, name, mobile, address, email_id, gst_number, updated_at")
      .eq("created_id", userId)
      .eq("shop_id", shopId)
      .order("updated_at", { ascending: false })
      .maybeSingle();

    if (error) {
      console.error("Error fetching suppliers:", error);
      return null;
    }
    console.log("getSuppliersByUserAndShop added successfully", data);
    return data;
  },

  async addSupplier(userId, shopId, name, mobile, address, email, gst) {
    const { data, error } = await supabase
      .from("suppliers")
      .insert({
        created_id: userId,
        shop_id: shopId,
        name: name,
        mobile: mobile,
        address: address,
        email_id: email,
        gst_number: gst,
      })
      .select();

    if (error) {
      console.error("Error addSupplier:", error);
      return null;
    }
    console.log("Data addSupplier", data);
    return data;
  },
};

module.exports = supplierQueries;
