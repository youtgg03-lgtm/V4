/* ============================================================
   Uchiro Store — Mini App (app.js)
   ============================================================ */

const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
  tg.ready();
  tg.expand();
}

let CURRENT_LANG = "KM";
let CURRENT_CATEGORY = "ALL";
let ALL_ITEMS = [];
let ACTIVE_ORDER_ID = null;
let TOTP_INTERVAL = null;

const I18N = {
  KM: {
    tab_shop: "ទំនិញ",
    tab_orders: "Order",
    tab_help: "ជំនួយ",
    my_orders: "ការបញ្ជាទិញរបស់ខ្ញុំ",
    help_title: "ជំនួយ & ព័ត៌មាន",
    warranty_policy: "គោលការណ៍ធានា (Warranty)",
    how_to_login_full: "របៀបដំឡើង & ចូលប្រើ",
    song: "តន្ត្រី",
    contact_admin: "ទាក់ទង Admin",
    checkout: "ការទូទាត់",
    coupon_code: "លេខកូដបញ្ចុះតម្លៃ",
    apply: "ប្រើ",
    total: "សរុប",
    upload_screenshot: "បញ្ចូលរូបភាពផ្ទេរប្រាក់",
    submit_order: "បញ្ជាក់ការបញ្ជាទិញ",
    waiting: "កំពុងរង់ចាំការអនុម័ត…",
    rejected: "ត្រូវបានបដិសេធ",
    delivered: "ទទួលបានទំនិញរួចរាល់",
    back_home: "ត្រឡប់ទៅដើម",
    view_orders: "មើលការបញ្ជាទិញ",
  },
  EN: {
    tab_shop: "Shop",
    tab_orders: "Orders",
    tab_help: "Help",
    my_orders: "My Orders",
    help_title: "Help & Info",
    warranty_policy: "Warranty Policy",
    how_to_login_full: "How to Install & Log In",
    song: "Music",
    contact_admin: "Contact Admin",
    checkout: "Checkout",
    coupon_code: "Coupon Code",
    apply: "Apply",
    total: "Total",
    upload_screenshot: "Upload Payment Screenshot",
    submit_order: "Submit Order",
    waiting: "Waiting for approval…",
    rejected: "Order Rejected",
    delivered: "Delivered Successfully",
    back_home: "Back to Home",
    view_orders: "View My Orders",
  }
};

function getInitData() {
  return tg && tg.initData ? tg.initData : "";
}

function toggleLang() {
  CURRENT_LANG = CURRENT_LANG === "KM" ? "EN" : "KM";
  document.getElementById("lang-label").textContent = CURRENT_LANG;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (I18N[CURRENT_LANG][key]) {
      el.textContent = I18N[CURRENT_LANG][key];
    }
  });
  renderItems();
}

function switchTab(tab) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  const activeScreen = document.getElementById("screen-" + tab);
  if (activeScreen) activeScreen.classList.remove("hidden");

  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === tab);
  });

  if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred("light");

  if (tab === "shop") loadShop();
  if (tab === "orders") loadOrders();
}

/* ---------------- SHOP LOGIC ---------------- */
async function loadShop() {
  try {
    const data = await API.items();
    ALL_ITEMS = data.items || [];
    renderChips(data.categories || []);
    renderItems();
  } catch (e) {
    console.error("Failed to load shop items", e);
  }
}

function renderChips(categories) {
  const mount = document.getElementById("chip-row");
  if (!mount) return;
  const cats = ["ALL", ...categories];
  mount.innerHTML = cats.map(c => `
    <button class="chip ${c === CURRENT_CATEGORY ? 'active' : ''}" onclick="selectCategory('${c}')">
      ${c}
    </button>
  `).join("");
}

function selectCategory(cat) {
  CURRENT_CATEGORY = cat;
  document.querySelectorAll("#chip-row .chip").forEach(b => {
    b.classList.toggle("active", b.textContent.trim() === cat);
  });
  renderItems();
}

function renderItems() {
  const mount = document.getElementById("product-grid");
  if (!mount) return;

  const filtered = CURRENT_CATEGORY === "ALL" 
    ? ALL_ITEMS 
    : ALL_ITEMS.filter(i => i.category === CURRENT_CATEGORY);

  if (!filtered.length) {
    mount.innerHTML = `<div class="muted" style="grid-column:1/-1; text-align:center; padding:30px;">គ្មានទំនិញក្នុងប្រភេទនេះទេ</div>`;
    return;
  }

  mount.innerHTML = filtered.map(item => `
    <div class="product-card" onclick="openProduct(${item.id})">
      ${item.photo_url ? `<img src="${item.photo_url}" class="p-img">` : '<div class="p-img no-img">📦</div>'}
      <div class="p-details">
        <div class="p-name">${item.name}</div>
        <div class="row-between" style="margin-top:6px;">
          <div class="p-price">$${item.price}</div>
          <span class="p-stock ${item.quantity > 0 ? 'in' : 'out'}">${item.quantity > 0 ? 'In Stock' : 'Out'}</span>
        </div>
      </div>
    </div>
  `).join("");
}

function openProduct(id) {
  const item = ALL_ITEMS.find(i => i.id === id);
  if (!item) return;

  const body = document.getElementById("product-sheet-body");
  body.innerHTML = `
    ${item.photo_url ? `<img src="${item.photo_url}" style="width:100%; border-radius:12px; max-height:220px; object-fit:cover; margin-bottom:12px;">` : ''}
    <h2 style="font-size:18px; margin-bottom:4px;">${item.name}</h2>
    <div class="p-price" style="font-size:20px; margin-bottom:10px;">$${item.price}</div>
    <p class="muted" style="font-size:13px; line-height:1.6; margin-bottom:16px;">${item.description || 'គ្មានការពិពណ៌នាបន្ថែម'}</p>
    <button class="btn-primary" onclick="openCheckout(${item.id})">ទិញឥឡូវ ($${item.price})</button>
  `;

  document.getElementById("backdrop").classList.add("active");
  document.getElementById("product-sheet").classList.add("active");
}

/* ---------------- CHECKOUT LOGIC ---------------- */
let CURRENT_ITEM = null;
let SCREENSHOT_FILE = null;

async function openCheckout(itemId) {
  CURRENT_ITEM = ALL_ITEMS.find(i => i.id === itemId);
  if (!CURRENT_ITEM) return;

  closeSheet();

  document.getElementById("checkout-item-name").textContent = CURRENT_ITEM.name;
  document.getElementById("checkout-total").textContent = `$${CURRENT_ITEM.price}`;
  document.getElementById("coupon-input").value = "";
  document.getElementById("coupon-msg").textContent = "";
  document.getElementById("checkout-photo-status").textContent = "";
  SCREENSHOT_FILE = null;

  document.getElementById("checkout-pending").classList.remove("hidden");
  document.getElementById("checkout-waiting").classList.add("hidden");
  document.getElementById("checkout-rejected").classList.add("hidden");
  document.getElementById("checkout-success").classList.add("hidden");

  document.getElementById("backdrop").classList.add("active");
  document.getElementById("checkout-sheet").classList.add("active");

  const quote = await API.quote({ item_id: itemId, init_data: getInitData() });
  const qrBox = document.getElementById("checkout-qr");
  if (quote.qr_url) {
    qrBox.innerHTML = `<img src="${quote.qr_url}" style="width:180px; height:180px; margin:auto; display:block; border-radius:8px;">`;
  } else {
    qrBox.innerHTML = `<div class="muted" style="font-size:12px; text-align:center; padding:20px;">${quote.note || 'Scan KHQR'}</div>`;
  }
}

function onScreenshotPicked(input) {
  if (input.files && input.files[0]) {
    SCREENSHOT_FILE = input.files[0];
    document.getElementById("checkout-photo-status").textContent = `Selected: ${SCREENSHOT_FILE.name}`;
  }
}

async function applyCoupon() {
  const code = document.getElementById("coupon-input").value.trim();
  if (!code || !CURRENT_ITEM) return;

  const quote = await API.quote({
    item_id: CURRENT_ITEM.id,
    coupon_code: code,
    init_data: getInitData()
  });

  const msg = document.getElementById("coupon-msg");
  if (quote.coupon_valid) {
    msg.style.color = "var(--mint)";
    msg.textContent = `Applied: ${quote.discount_applied}`;
    document.getElementById("checkout-total").textContent = `$${quote.total}`;
  } else {
    msg.style.color = "var(--crimson)";
    msg.textContent = quote.coupon_error || "Invalid coupon";
  }
}

async function submitOrder() {
  if (!CURRENT_ITEM) return;
  if (!SCREENSHOT_FILE) {
    return alert("សូម Upload រូបភាពផ្ទេរប្រាក់ជាមុនសិន");
  }

  const form = new FormData();
  form.append("init_data", getInitData());
  form.append("item_id", CURRENT_ITEM.id);
  form.append("coupon_code", document.getElementById("coupon-input").value.trim());
  form.append("photo", SCREENSHOT_FILE);

  document.getElementById("submit-order-btn").disabled = true;
  document.getElementById("submit-order-btn").textContent = "Uploading…";

  try {
    const res = await API.submitOrder(form);
    if (res.error) {
      alert(res.error);
      document.getElementById("submit-order-btn").disabled = false;
      document.getElementById("submit-order-btn").textContent = "Submit order";
      return;
    }

    ACTIVE_ORDER_ID = res.order_id;
    document.getElementById("checkout-pending").classList.add("hidden");
    document.getElementById("checkout-waiting").classList.remove("hidden");
    document.getElementById("checkout-waiting-order-id").textContent = `#${res.order_id}`;

    startOrderPolling(res.order_id);
  } catch (e) {
    alert("Error submitting order");
    document.getElementById("submit-order-btn").disabled = false;
  }
}

function startOrderPolling(orderId) {
  const poller = setInterval(async () => {
    try {
      const st = await API.orderStatus(orderId, getInitData());
      if (st.status === "approved") {
        clearInterval(poller);
        showDelivery(st);
      } else if (st.status === "rejected") {
        clearInterval(poller);
        document.getElementById("checkout-waiting").classList.add("hidden");
        document.getElementById("checkout-rejected").classList.remove("hidden");
      }
    } catch (e) {}
  }, 3000);
}

function showDelivery(data) {
  document.getElementById("checkout-waiting").classList.add("hidden");
  document.getElementById("checkout-success").classList.remove("hidden");
  document.getElementById("checkout-item-name-2").textContent = data.item_name;

  let html = `<div class="order-card" style="background:var(--surface-2); font-size:13px; line-height:1.6;">`;
  if (data.fields) {
    if (data.fields.login_name) html += `<div><strong>Username:</strong> <code>${data.fields.login_name}</code></div>`;
    if (data.fields.login_password) html += `<div><strong>Password:</strong> <code>${data.fields.login_password}</code></div>`;
  }
  if (data.delivery_info) {
    html += `<div style="margin-top:8px;">${data.delivery_info}</div>`;
  }
  html += `</div>`;
  document.getElementById("delivery-blocks").innerHTML = html;
}

/* ---------------- ORDERS LIST ---------------- */
async function loadOrders() {
  const mount = document.getElementById("orders-list");
  mount.innerHTML = `<div class="order-card">Loading…</div>`;
  try {
    const data = await API.myOrders(getInitData());
    if (!data.orders || !data.orders.length) {
      mount.innerHTML = `<div class="order-card">មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ</div>`;
      return;
    }
    mount.innerHTML = data.orders.map(o => `
      <div class="order-card">
        <div class="row-between">
          <div>
            <span class="mono muted">#${o.id}</span>
            <div style="font-weight:600; margin-top:2px;">${o.item_name}</div>
          </div>
          <span class="status-chip chip-${o.status}">${o.status}</span>
        </div>
      </div>
    `).join("");
  } catch (e) {
    mount.innerHTML = `<div class="order-card">Error loading orders</div>`;
  }
}

/* ---------------- MODALS & HELPERS ---------------- */
function closeSheet() {
  document.getElementById("backdrop").classList.remove("active");
  document.querySelectorAll(".sheet").forEach(s => s.classList.remove("active"));
}

function openGuideSheet() {
  document.getElementById("backdrop").classList.add("active");
  document.getElementById("guide-sheet").classList.add("active");
}

function backToHome() {
  closeSheet();
  switchTab("shop");
}

function goToMyOrders() {
  closeSheet();
  switchTab("orders");
}

function toggleSong() {
  const audio = document.getElementById("bg-music");
  const btn = document.getElementById("song-toggle");
  if (!audio) return;
  if (audio.paused) {
    audio.play().then(() => {
      btn.innerHTML = `<tg-emoji emoji-id="5388632425314140043">🔊</tg-emoji> <span data-i18n="song">Music</span> ON`;
    }).catch(() => {});
  } else {
    audio.pause();
    btn.innerHTML = `<tg-emoji emoji-id="5388632425314140043">🔈</tg-emoji> <span data-i18n="song">Music</span> OFF`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  switchTab("shop");
});
