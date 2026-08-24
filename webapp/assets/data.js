/* ============================================================
   Telegram Mini App API Client & Store Engine
   ============================================================ */

function getInitData() {
  return (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) || '';
}

const API = {
  items: () => fetch('/api/items').then(r => r.json()),

  quote: (item_id, coupon_code) => fetch('/api/order/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_id, coupon_code: coupon_code || undefined, init_data: getInitData() })
  }).then(r => r.json()),

  submit: (item_id, khqr_md5, photoFile, coupon_code) => {
    const form = new FormData();
    form.append('init_data', getInitData());
    form.append('item_id', item_id);
    if (khqr_md5) form.append('khqr_md5', khqr_md5);
    if (coupon_code) form.append('coupon_code', coupon_code);
    if (photoFile) form.append('photo', photoFile);
    return fetch('/api/order/submit', { method: 'POST', body: form }).then(r => r.json());
  },

  status: (order_id) => fetch(`/api/order/${order_id}/status?init_data=${encodeURIComponent(getInitData())}`).then(r => r.json()),
  refreshCode: (order_id) => fetch(`/api/order/${order_id}/refresh-code?init_data=${encodeURIComponent(getInitData())}`).then(r => r.json()),
  myOrders: () => fetch(`/api/my-orders?init_data=${encodeURIComponent(getInitData())}`).then(r => r.json()),
  rules: () => fetch('/api/rules').then(r => r.json()),

  // ---- Admin Endpoints ----
  adminVerify: () => fetch('/api/admin/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ init_data: getInitData() })
  }).then(r => r.json()),
  adminItems: () => fetch(`/api/admin/items?init_data=${encodeURIComponent(getInitData())}`).then(r => r.json()),
  adminOrders: () => fetch(`/api/admin/orders?init_data=${encodeURIComponent(getInitData())}`).then(r => r.json()),
  adminCreateItem: (formData) => {
    formData.append('init_data', getInitData());
    return fetch('/api/admin/items', { method: 'POST', body: formData }).then(r => r.json());
  },
  adminCoupons: () => fetch(`/api/admin/coupons?init_data=${encodeURIComponent(getInitData())}`).then(r => r.json()),
  adminDisableCoupon: (code) => fetch('/api/admin/coupons/disable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ init_data: getInitData(), code })
  }).then(r => r.json()),
  adminOrderDecision: (order_id, action) => fetch(`/api/admin/orders/${order_id}/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ init_data: getInitData() })
  }).then(r => r.json()),
};

/* ============================================================
   Category Emoji Config
   ============================================================ */
const CATEGORY_EMOJI = {
  "Account": "👑",
  "Fruit": "🍈",
  "Gamepass": "🎫",
  "Evade": "🏃",
  "Robux": "💎",
  "Blade Ball": "⚔️",
  "MM2": "🔪",
};
function categoryEmoji(cat) { return CATEGORY_EMOJI[cat] || "📦"; }

const CATEGORIES = [
  { id: "all", name_km: "ទាំងអស់", name_en: "All", emoji: "📁" },
  { id: "Account", name_km: "Account", name_en: "Account", emoji: "👑" },
  { id: "Fruit", name_km: "Fruit", name_en: "Fruit", emoji: "🍈" },
  { id: "Gamepass", name_km: "Gamepass", name_en: "Gamepass", emoji: "🎫" },
  { id: "Evade", name_km: "Evade", name_en: "Evade", emoji: "🏃" },
  { id: "Robux", name_km: "Robux", name_en: "Robux", emoji: "💎" },
  { id: "Blade Ball", name_km: "Blade Ball", name_en: "Blade Ball", emoji: "⚔️" },
  { id: "MM2", name_km: "MM2", name_en: "MM2", emoji: "🔪" }
];

/* ============================================================
   KH / EN Dictionary & Translation Engine
   ============================================================ */
const I18N = {
  en: {
    tab_shop: "Shop", tab_orders: "Orders", tab_help: "Help",
    all: "All", buy_now: "Buy now", sold_out: "Sold out", new: "NEW",
    warranty_days: (d) => `${d}D`, trade: "Trade",
    checkout: "Checkout", total: "Total", upload_screenshot: "Upload payment screenshot",
    no_screenshot: "No screenshot selected yet", submit_order: "Submit order",
    coupon_code: "Coupon code", apply: "Apply",
    waiting: "Waiting for confirmation…", delivered: "Delivered ✅", rejected: "Order rejected",
    not_confirmed: "Not confirmed — contact admin", check_my_account: "Check my account",
    back_home: "Back to home", view_orders: "View my orders",
    delivery_details: "Delivery details", live_code: "Live authenticator code", refresh: "Refresh",
    how_to_login: "How to log in with this code", my_orders: "My orders", no_orders: "No orders yet",
    warranty_left: "warranty left", warranty_expired: "Warranty expired",
    help_title: "Help", warranty_policy: "Warranty policy", contact_admin: "Message admin",
    join_channel: "Join channel", song: "Relax music", how_to_login_full: "How to install & log in",
  },
  km: {
    tab_shop: "ទំនិញ", tab_orders: "ការបញ្ជាទិញ", tab_help: "ជំនួយ",
    all: "ទាំងអស់", buy_now: "ទិញឥឡូវ", sold_out: "អស់ស្តុក", new: "ថ្មី",
    warranty_days: (d) => `${d}ថ្ងៃ`, trade: "Trade",
    checkout: "ទូទាត់", total: "សរុប", upload_screenshot: "Upload រូបភាពទូទាត់",
    no_screenshot: "មិនទាន់ជ្រើសរើសរូបភាពទេ", submit_order: "ដាក់ស្នើការបញ្ជាទិញ",
    coupon_code: "លេខកូដបញ្ចុះតម្លៃ", apply: "ប្រើ",
    waiting: "កំពុងរង់ចាំបញ្ជាក់…", delivered: "ប្រគល់ជូនរួច ✅", rejected: "Order មិនត្រូវបានអនុម័ត",
    not_confirmed: "មិនទាន់បញ្ជាក់ — ទាក់ទង Admin", check_my_account: "មើលគណនីរបស់ខ្ញុំ",
    back_home: "ត្រឡប់ទៅដើម", view_orders: "មើលការបញ្ជាទិញរបស់ខ្ញុំ",
    delivery_details: "ព័ត៌មានប្រគល់ជូន", live_code: "លេខកូដផ្ទាល់", refresh: "ធ្វើឲ្យស្រស់",
    how_to_login: "របៀបប្រើលេខកូដនេះ", my_orders: "ការបញ្ជាទិញរបស់ខ្ញុំ", no_orders: "មិនទាន់មាន Order ទេ",
    warranty_left: "នៅសល់", warranty_expired: "Warranty ផុតកំណត់",
    help_title: "ជំនួយ", warranty_policy: "វិធាន Warranty", contact_admin: "ទាក់ទងម្ចាស់ហាង",
    join_channel: "ចូល Channel", song: "តន្ត្រី", how_to_login_full: "របៀបដំឡើង និងចូលគណនី",
  }
};

let currentLang = 'km';
let selectedCategory = 'all';
let allItems = [];
let _emojiMap = null;

function t(key, ...args) {
  const val = (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
  return typeof val === 'function' ? val(...args) : val;
}

function setLang(lang) {
  if (I18N[lang]) {
    currentLang = lang;
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    renderCategories();
    renderProducts();
  }
}

function toggleLang() {
  setLang(currentLang === 'km' ? 'en' : 'km');
  const label = document.getElementById('lang-label');
  if (label) label.textContent = currentLang.toUpperCase();
}

/* ============================================================
   Direct Premium Emoji Generator (Zero-Flicker)
   ============================================================ */
async function loadEmojiMap() {
  if (!_emojiMap) {
    try {
      const res = await fetch('assets/emoji-files.json');
      if (res.ok) _emojiMap = await res.json();
    } catch (e) {
      console.warn('Could not load emoji map:', e);
      _emojiMap = {};
    }
  }
  return _emojiMap;
}

function emojiHtml(emojiChar) {
  if (!_emojiMap || !_emojiMap[emojiChar]) return emojiChar;
  const filename = _emojiMap[emojiChar];
  const ext = filename.split('.').pop().toLowerCase();

  if (ext === 'webm') {
    return `<video src="assets/emojis/${filename}" autoplay loop muted playsinline class="premium-emoji premium-emoji-rendered"></video>`;
  } else if (ext === 'json') {
    return `<span class="lottie-emoji premium-emoji-rendered" data-src="assets/emojis/${filename}"></span>`;
  } else {
    return `<img src="assets/emojis/${filename}" alt="${emojiChar}" class="premium-emoji premium-emoji-rendered">`;
  }
}

function initLottieAnimations(container = document.body) {
  if (!window.lottie) return;
  container.querySelectorAll('.lottie-emoji:not([data-rendered])').forEach(el => {
    el.setAttribute('data-rendered', 'true');
    lottie.loadAnimation({
      container: el,
      path: el.dataset.src,
      renderer: 'svg',
      loop: true,
      autoplay: true
    });
  });
}

/* Scans static text nodes once without causing flicker loops */
async function loadPremiumEmojis(targetNode = document.body) {
  await loadEmojiMap();
  if (!_emojiMap) return;

  const emojiChars = Object.keys(_emojiMap).sort((a, b) => b.length - a.length);
  if (emojiChars.length === 0) return;

  const pattern = new RegExp(
    emojiChars.map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'g'
  );

  const walker = document.createTreeWalker(
    targetNode,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (['SCRIPT', 'STYLE', 'TG-EMOJI', 'TEXTAREA', 'INPUT', 'VIDEO'].includes(parent.nodeName)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.closest('.premium-emoji-rendered') || parent.closest('.lottie-emoji')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach(node => {
    const text = node.nodeValue;
    pattern.lastIndex = 0;
    if (!pattern.test(text)) return;
    pattern.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      const before = text.slice(lastIndex, match.index);
      if (before) frag.appendChild(document.createTextNode(before));

      const wrapper = document.createElement('span');
      wrapper.innerHTML = emojiHtml(match[0]);
      while (wrapper.firstChild) {
        frag.appendChild(wrapper.firstChild);
      }

      lastIndex = pattern.lastIndex;
    }

    const after = text.slice(lastIndex);
    if (after) frag.appendChild(document.createTextNode(after));

    if (node.parentNode) {
      node.parentNode.replaceChild(frag, node);
    }
  });

  initLottieAnimations(targetNode);
}

/* ============================================================
   Category & Product Rendering Flow
   ============================================================ */
function renderCategories() {
  const grid = document.getElementById('collection-grid') || document.getElementById('category-grid');
  const chips = document.getElementById('chip-row') || document.getElementById('category-pills');

  const counts = { all: allItems.length };
  allItems.forEach(item => {
    counts[item.category] = (counts[item.category] || 0) + (item.quantity || 1);
  });

  if (grid) {
    grid.innerHTML = CATEGORIES.map(cat => `
      <div class="collection-tile ${selectedCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}" onclick="selectCategory('${cat.id}')">
        <div class="emoji">${emojiHtml(cat.emoji)}</div>
        <div class="label">${currentLang === 'km' ? cat.name_km : cat.name_en}</div>
        <div class="count">${counts[cat.id] || 0}</div>
      </div>
    `).join('');
    initLottieAnimations(grid);
  }

  if (chips) {
    chips.innerHTML = CATEGORIES.map(cat => `
      <button class="chip ${selectedCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}" onclick="selectCategory('${cat.id}')">
        ${currentLang === 'km' ? cat.name_km : cat.name_en}
      </button>
    `).join('');
  }
}

function renderProducts() {
  const pgrid = document.getElementById('product-grid');
  if (!pgrid) return;

  const filtered = selectedCategory === 'all' 
    ? allItems 
    : allItems.filter(i => i.category === selectedCategory);

  if (filtered.length === 0) {
    pgrid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;">គ្មានទំនិញទេ</div>`;
    return;
  }

  pgrid.innerHTML = filtered.map(item => `
    <div class="pcard ${item.quantity <= 0 ? 'sold-out' : ''}" onclick="openProductSheet(${item.id})">
      <div class="pcard-media">
        ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}">` : `<div class="placeholder-emoji">${emojiHtml(categoryEmoji(item.category))}</div>`}
        ${item.warranty_days ? `<div class="warranty-ribbon">${t('warranty_days', item.warranty_days)}</div>` : ''}
        ${item.is_new ? `<div class="new-badge">${t('new')}</div>` : ''}
      </div>
      <div class="pcard-body">
        <h3>${item.name}</h3>
        <div class="pcard-foot">
          <span class="price">$${item.price}</span>
          <span class="stock">${item.quantity > 0 ? item.quantity + ' left' : t('sold_out')}</span>
        </div>
        <button class="buy-btn" ${item.quantity <= 0 ? 'disabled' : ''}>${item.quantity > 0 ? t('buy_now') : t('sold_out')}</button>
      </div>
    </div>
  `).join('');

  initLottieAnimations(pgrid);
}

function selectCategory(catId) {
  selectedCategory = catId;

  // Toggle active styling without re-rendering category elements (prevents reload flicker)
  document.querySelectorAll('.collection-tile').forEach(el => {
    el.classList.toggle('active', el.dataset.cat === catId);
  });
  document.querySelectorAll('.chip').forEach(el => {
    el.classList.toggle('active', el.dataset.cat === catId);
  });

  renderProducts();
}

function switchTab(tab) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const activeScreen = document.getElementById('screen-' + tab);
  if (activeScreen) activeScreen.classList.remove('hidden');

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));

  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
  }

  if (tab === 'shop') {
    renderProducts();
  }
}

// Initial Bootstrap
document.addEventListener('DOMContentLoaded', async () => {
  await loadEmojiMap();

  try {
    const res = await API.items();
    allItems = res.items || res || [];
  } catch (err) {
    console.error('Failed to load items:', err);
    allItems = [];
  }

  renderCategories();
  renderProducts();
  await loadPremiumEmojis(document.body);
});
