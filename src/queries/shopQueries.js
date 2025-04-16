const supabase = require("../config/supabase");

const shopQueries = {
  async createShop(shopData) {
    const {
      name,
      address,
      pincode,
      mobile,
      business_type,
      gst_number,
      created_id,
      updated_id,
    } = shopData;

    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .insert([
        {
          name,
          address,
          pincode,
          mobile,
          business_type,
          gst_number,
          created_id,
          updated_id,
        },
      ])
      .select()
      .single();

    if (shopError) {
      console.log("createShop error", shopError);
      return null;
    }
    console.log("createShop data", shop);
    return shop;
  },

  // async getShopById(shopId) {
  //   const { data, error } = await supabase
  //     .from("shops")
  //     .select("*")
  //     .eq("id", shopId)
  //     .single();

  //   if (error) {
  //     throw error;
  //   }

  //   return data;
  // },
};

module.exports = shopQueries;
