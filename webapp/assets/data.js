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

  // Admin
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
   Exact Telegram Premium Emoji File Mapping
   ============================================================ */
const EMOJI_FILE_MAP = {
  "📁": "5854908544712707500.webm",
  "📦": "5854908544712707500.webm",
  "👑": "5310070232155436036.webp",
  "🍈": "6084765169940961891.webp",
  "🎫": "6301052490242597458.webp",
  "🏃": "5210965493887819972.webp",
  "💎": "5202189539967267386.webp",
  "⚔️": "5408935401442267103.json",
  "🔪": "5242288969550422350.webp",
  "🧾": "5264959791213586839.webm",
  "🛍️": "5836672976862319297.json",
  "🛍": "5373052667671093676.json",
  "🌐": "6107376940098786484.json",
  "📢": "6300742299114541958.webm",
  "👤": "5258011929993026890.json",
  "🎵": "5172447776205702031.json",
  "💬": "6106980145250177382.json",
  "📊": "5231200819986047254.json",
  "🚫": "5240241223632954241.json",
  "🛡️": "5251203410396458957.json",
  "🔒": "5296369303661067030.json",
  "🏷️": "5298877105000439431.json",
  "🛒": "5312361253610475399.json",
  "🎮": "5319247469165433798.json",
  "🔄": "5346269127059196142.json",
  "📭": "5352896944496728039.json",
  "📺": "5355012477883004708.json",
  "🔍": "5368460200875418560.webp",
  "3️⃣": "5381879959335738545.json",
  "2️⃣": "5381990043642502553.json",
  "4️⃣": "5382054253403577563.json",
  "1️⃣": "5382322671679708881.json",
  "🏴‍☠️": "5386372293263892965.json",
  "🔈": "5388632425314140043.json",
  "📞": "5390947107744008389.json",
  "5️⃣": "5391197405553107640.json",
  "📲": "5406809207947142040.json",
  "👋": "5413694143601842851.json",
  "🏠": "5416041192905265756.json",
  "🔑": "5420094143089111506.webm",
  "🛠️": "5462921117423384478.json",
  "👍": "5469770542288478598.json",
  "👇": "5470177992950946662.json",
  "📝": "5837003105228558796.json",
  "✅": "5904704361182798355.json",
  "📋": "5987635334945444280.json",
  "👥": "6001526766714227911.webp",
  "⚡": "6107022708376082350.json",
  "🎉": "6107318416874410520.json",
  "🔐": "6109136102868652214.json",
  "🟢": "6138568461481153914.webm",
  "✨": "6140944776691717029.webm",
  "🆕": "6147506120920405501.json",
  "🔴": "6170475670443922913.webm",
  "⚠️": "6265015769008969527.webm",
  "🎁": "6283073379184415506.json",
  "⏳": "6289745241511565742.json",
  "🔓": "6291893425239234198.json",
  "❓": "6298557526560479072.json",
  "❌": "6300696192640620174.json",
  "📈": "6300854578149593766.json",
  "🚀": "6300989332748506061.json",
  "💵": "6301016442582081020.json",
  "📜": "6323096332579899122.json",
  "🇰🇭": "5294018354527353443.webm",
  "📖": "5294018354527353443.webm"
};

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

/* ============================================================
   KH / EN Translation Engine
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

function t(key, ...args) {
  const val = (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
  return typeof val === 'function' ? val(...args) : val;
}

function setLang(lang) {
  if (I18N[lang]) {
    currentLang = lang;
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }
}

function toggleLang() {
  setLang(currentLang === 'km' ? 'en' : 'km');
  const label = document.getElementById('lang-label');
  if (label) label.textContent = currentLang.toUpperCase();
}

/* ============================================================
   Telegram Premium Emoji Live Replacement Engine
   ============================================================ */
function emojiHtml(emojiChar) {
  const filename = EMOJI_FILE_MAP[emojiChar];
  if (!filename) return emojiChar;

  const ext = filename.split('.').pop().toLowerCase();
  const path = `/assets/emojis/${filename}`;

  if (ext === 'webm') {
    return `<video src="${path}" autoplay loop muted playsinline class="premium-emoji"></video>`;
  } else if (ext === 'json') {
    return `<span class="lottie-emoji" data-src="${path}"></span>`;
  } else {
    return `<img src="${path}" alt="${emojiChar}" class="premium-emoji">`;
  }
}

function initLottie(el) {
  if (!window.lottie || el.dataset.rendered) return;
  el.dataset.rendered = "true";
  lottie.loadAnimation({
    container: el,
    path: el.dataset.src,
    renderer: 'svg',
    loop: true,
    autoplay: true
  });
}

const emojiRegex = new RegExp(
  Object.keys(EMOJI_FILE_MAP).sort((a, b) => b.length - a.length).map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'g'
);

let _isMutating = false;

function replaceTextEmojis(node) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return;
  const text = node.nodeValue;
  emojiRegex.lastIndex = 0;
  if (!emojiRegex.test(text)) return;
  emojiRegex.lastIndex = 0;

  const parent = node.parentNode;
  if (!parent) return;
  if (['SCRIPT', 'STYLE', 'TG-EMOJI', 'TEXTAREA', 'INPUT', 'VIDEO'].includes(parent.nodeName)) return;
  if (parent.closest('.premium-emoji') || parent.closest('.lottie-emoji')) return;

  const frag = document.createDocumentFragment();
  let lastIdx = 0;
  let match;

  while ((match = emojiRegex.exec(text)) !== null) {
    const before = text.slice(lastIdx, match.index);
    if (before) frag.appendChild(document.createTextNode(before));

    const temp = document.createElement('span');
    temp.innerHTML = emojiHtml(match[0]);
    while (temp.firstChild) {
      const child = temp.firstChild;
      frag.appendChild(child);
      if (child.classList && child.classList.contains('lottie-emoji')) {
        initLottie(child);
      }
    }
    lastIdx = emojiRegex.lastIndex;
  }

  const after = text.slice(lastIdx);
  if (after) frag.appendChild(document.createTextNode(after));

  parent.replaceChild(frag, node);
}

function scanElement(el) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
  if (['SCRIPT', 'STYLE', 'TG-EMOJI', 'TEXTAREA', 'INPUT', 'VIDEO'].includes(el.nodeName)) return;

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(replaceTextEmojis);
}

// Global Interceptor: Instant conversion whenever app.js or user clicks change the DOM
const emojiObserver = new MutationObserver((mutations) => {
  if (_isMutating) return;
  _isMutating = true;

  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        replaceTextEmojis(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        scanElement(node);
      }
    }
  }

  _isMutating = false;
});

document.addEventListener('DOMContentLoaded', () => {
  scanElement(document.body);
  emojiObserver.observe(document.body, { childList: true, subtree: true });
});
