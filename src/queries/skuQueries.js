const supabase = require("../config/supabase");

const skuQueries = {
  async getSkusByShop(shopId) {
    const { data, error } = await supabase
      .from("sku")
      .select(
        `
        id,
        name,
        type,
        kind,
        is_active,
        ideal_selling_price,
        created_at,
        updated_at
      `
      )
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getSkuById(skuId, shopId) {
    const { data, error } = await supabase
      .from("sku")
      .select(
        `
        id,
        name,
        type,
        kind,
        is_active,
        ideal_selling_price,
        created_at,
        updated_at
      `
      )
      .eq("id", skuId)
      .eq("shop_id", shopId)
      .single();

    if (error) throw error;
    return data;
  },
};

module.exports = skuQueries;
