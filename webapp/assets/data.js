/* ============================================================
   Telegram Mini App API Client & Utilities
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

function setLang(lang) {
  if (I18N[lang]) {
    currentLang = lang;
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }
}

function t(key, ...args) {
  const val = (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
  return typeof val === 'function' ? val(...args) : val;
}

/* ============================================================
   Telegram Premium Animated Emoji Replacer
   ============================================================ */
let _emojiMap = null;

async function loadPremiumEmojis(targetNode = document.body) {
  try {
    if (!_emojiMap) {
      const res = await fetch('assets/emoji-files.json');
      if (!res.ok) return;
      _emojiMap = await res.json();
    }

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
          const parentTag = node.parentNode ? node.parentNode.nodeName : '';
          if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(parentTag)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('premium-emoji-rendered')) {
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

        const filename = _emojiMap[match[0]];
        const ext = filename.split('.').pop().toLowerCase();
        let el;

        if (ext === 'webm') {
          el = document.createElement('video');
          el.src = `assets/emojis/${filename}`;
          el.autoplay = true;
          el.loop = true;
          el.muted = true;
          el.playsInline = true;
          el.className = 'premium-emoji premium-emoji-rendered';
        } else if (ext === 'json') {
          el = document.createElement('span');
          el.className = 'lottie-emoji premium-emoji-rendered';
          el.dataset.src = `assets/emojis/${filename}`;
        } else {
          el = document.createElement('img');
          el.src = `assets/emojis/${filename}`;
          el.alt = match[0];
          el.className = 'premium-emoji premium-emoji-rendered';
        }

        frag.appendChild(el);
        lastIndex = pattern.lastIndex;
      }

      const after = text.slice(lastIndex);
      if (after) frag.appendChild(document.createTextNode(after));

      if (node.parentNode) {
        node.parentNode.replaceChild(frag, node);
      }
    });

    if (window.lottie) {
      targetNode.querySelectorAll('.lottie-emoji:not([data-rendered])').forEach(el => {
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
  } catch (err) {
    console.warn('Emoji replacement failed:', err);
  }
}

// Auto-run when the initial HTML loads
document.addEventListener('DOMContentLoaded', () => loadPremiumEmojis());
