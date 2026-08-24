// webapp/assets/data.js
function getInitData() {
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
    return window.Telegram.WebApp.initData;
  }
  return "";
}

const API = {
  async adminItems() {
    const res = await fetch(`/api/admin/items?init_data=${encodeURIComponent(getInitData())}`);
    return await res.json();
  },
  async adminOrders() {
    const res = await fetch(`/api/admin/orders?init_data=${encodeURIComponent(getInitData())}`);
    return await res.json();
  },
  async adminCoupons() {
    const res = await fetch(`/api/admin/coupons?init_data=${encodeURIComponent(getInitData())}`);
    return await res.json();
  },
  async adminOrderDecision(id, action) {
    const res = await fetch(`/api/admin/orders/${id}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ init_data: getInitData() })
    });
    return await res.json();
  },
  async adminDisableCoupon(code) {
    const res = await fetch(`/api/admin/coupons/disable`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, init_data: getInitData() })
    });
    return await res.json();
  },
  async adminCreateItem(formData) {
    formData.append("init_data", getInitData());
    const res = await fetch("/api/admin/items", {
      method: "POST",
      body: formData
    });
    return await res.json();
  }
};
