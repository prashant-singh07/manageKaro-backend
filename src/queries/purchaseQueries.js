const supabase = require("../config/supabase");

const purchaseQueries = {
  async createPurchaseOrder(
    userId,
    shopId,
    supplierId,
    purchase_date,
    payment_mode,
    total_amount,
    total_quantity
  ) {
    const { data, error } = await supabase
      .from("purchase")
      .insert({
        created_id: userId,
        supplier_id: supplierId,
        purchase_date,
        total_amount,
        total_quantity,
        shop_id: shopId,
        payment_mode,
      })
      .select("*")
      .single();

    if (error) {
      console.log("Error createPurchaseOrder", error);
      return null;
    }

    console.log("Data createPurchaseOrder", data);
    return data;
  },

  async createPurchaseItems(skuList) {
    const { data, error } = await supabase
      .from("purchase_items")
      .insert(skuList)
      .select();

    if (error) {
      console.log("Error createPurchaseItems", error);
      return null;
    }

    console.log("Data createPurchaseItems", data);
    return data;
  },

  async getAllPurchase(userId, shopId) {
    const { data, error } = await supabase
      .from("purchase")
      .select("*")
      .eq("created_id", userId)
      .eq("shop_id", shopId);

    if (error) {
      console.log("Error getAllPurchase", error);
      return null;
    }

    console.log("Data getAllPurchase", data);
    return data;
  },

  async getPurchaseDetails(purchaseId) {
    const { data, error } = await supabase
      .from("purchase_items")
      .select("*")
      .eq("po_id", purchaseId);

    if (error) {
      console.log("Error getPurchaseDetails", error);
      return null;
    }

    console.log("Data getPurchaseDetails", data);
    return data;
  },
};

module.exports = purchaseQueries;
