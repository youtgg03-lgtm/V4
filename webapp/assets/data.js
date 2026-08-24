const API = {
  async items(cat = "") {
    const res = await fetch("/api/items" + (cat ? `?category=${encodeURIComponent(cat)}` : ""));
    return await res.json();
  },
  async rules() {
    const res = await fetch("/api/rules");
    return await res.json();
  },
  async quote(data) {
    const res = await fetch("/api/order/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },
  async submitOrder(formData) {
    const res = await fetch("/api/order/submit", {
      method: "POST",
      body: formData,
    });
    return await res.json();
  },
  async orderStatus(orderId, initData = "") {
    const res = await fetch(`/api/order/${orderId}/status?init_data=${encodeURIComponent(initData)}`);
    return await res.json();
  },
  async refreshCode(orderId) {
    const res = await fetch(`/api/order/${orderId}/refresh-code`);
    return await res.json();
  },
  async myOrders(initData = "") {
    const res = await fetch(`/api/my-orders?init_data=${encodeURIComponent(initData)}`);
    return await res.json();
  },
  async adminItems() {
    const res = await fetch("/api/admin/items");
    return await res.json();
  },
  async adminOrders() {
    const res = await fetch("/api/admin/orders");
    return await res.json();
  },
  async adminCoupons() {
    const res = await fetch("/api/admin/coupons");
    return await res.json();
  },
  async adminOrderDecision(id, action) {
    const res = await fetch(`/api/admin/orders/${id}/${action}`, { method: "POST" });
    return await res.json();
  },
  async adminDisableCoupon(code) {
    const res = await fetch("/api/admin/coupons/disable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return await res.json();
  },
  async adminCreateItem(formData) {
    const res = await fetch("/api/admin/items", {
      method: "POST",
      body: formData,
    });
    return await res.json();
  },
};
