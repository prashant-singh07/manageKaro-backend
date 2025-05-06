const supabase = require("../config/supabase");

const skuQueries = {
  async getSkusByUserAndShop(userId, shopId) {
    const { data, error } = await supabase
      .from("sku")
      .select(
        `
        id,
        name,
        type,
        kind,
        size,
        is_live,
        ideal_selling_price,
        updated_at
      `
      )
      .eq("created_id", userId)
      .eq("shop_id", shopId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.log("Error getSkusByUserAndShop", error);
      return null;
    }
    console.log("Data getSkusByUserAndShop", data);
    return data;
  },

  async addNewSku(userId, shopId, name, type, kind, size, ideal_selling_price) {
    const { data, error } = await supabase
      .from("sku")
      .insert({
        created_id: userId,
        shop_id: shopId,
        name,
        type,
        kind,
        size,
        ideal_selling_price,
      })
      .select()
      .single();

    if (error) {
      console.log("Error addNewSku", error);
      return null;
    }
    console.log("Data addNewSku", data);
    return data;
  },

  async getSkuDetails(skuId) {
    const { data, error } = await supabase
      .from("sku")
      .select("*")
      .eq("id", skuId)
      .maybeSingle();

    if (error) {
      console.log("Error getSkuDetails", error);
      return null;
    }
    console.log("Data getSkuDetails", data);
    return data;
  },
};

module.exports = skuQueries;
