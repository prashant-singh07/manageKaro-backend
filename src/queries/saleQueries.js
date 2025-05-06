const supabase = require("../config/supabase");

const saleQueries = {
  async createSaleOrder(
    userId,
    shopId,
    customer_name,
    customer_mobile,
    sale_date,
    sale_amount,
    sale_quantity,
    payment_mode
  ) {
    const { data, error } = await supabase
      .from("sales")
      .insert({
        created_id: userId,
        shop_id: shopId,
        customer_name,
        customer_mobile,
        sale_date,
        sale_amount,
        sale_quantity,
        payment_mode,
      })
      .select("*")
      .single();

    if (error) {
      console.log("Error createSaleOrder", error);
      return null;
    }

    console.log("Data createSaleOrder", data);
    return data;
  },

  async createSaleItems(salesItems) {
    const { data, error } = await supabase
      .from("sales_items")
      .insert(salesItems)
      .select();

    if (error) {
      console.log("Error createSaleItems", error);
      return null;
    }

    console.log("Data createSaleItems", data);
    return data;
  },

  async getAllSales(user_id, shop_id) {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("created_id", user_id)
      .eq("shop_id", shop_id)
      .order("updated_at", { ascending: false });
    if (error) {
      console.log("Error getAllSales", error);
      return null;
    }

    console.log("Data getAllSales", data);
    return data;
  },
};

module.exports = saleQueries;
