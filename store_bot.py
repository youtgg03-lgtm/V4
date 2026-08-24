"""
store_bot.py — Uchiro Store (customer-facing bot)
"""

import logging
from telegram import Update, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton, BotCommand
from telegram.ext import Application, CommandHandler, ContextTypes

import database as db
from config import STORE_BOT_TOKEN, WEBAPP_URL, ADMIN_USERNAME, CHANNEL_USERNAME, STORE_NAME

logging.basicConfig(level=logging.INFO)


def _open_app_keyboard():
    if not WEBAPP_URL:
        return None
    return InlineKeyboardMarkup([[
        InlineKeyboardButton("🛍️ បើក Uchiro Store", web_app=WebAppInfo(url=WEBAPP_URL))
    ]])


async def _safe_reply(update: Update, html_text: str, fallback_text: str, reply_markup=None):
    """Sends HTML with custom emojis; falls back to standard text if Telegram rejects custom emoji IDs."""
    try:
        await update.message.reply_text(html_text, parse_mode="HTML", reply_markup=reply_markup)
    except Exception as err:
        logging.warning(f"HTML send failed ({err}), sending fallback text.")
        await update.message.reply_text(fallback_text, reply_markup=reply_markup)


async def start_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    db.touch_user(user.id, user.username)

    html_text = (
        f'<tg-emoji emoji-id="5413694143601842851">👋</tg-emoji> សូមស្វាគមន៍មកកាន់ <b>{STORE_NAME}</b>!\n\n'
        '<tg-emoji emoji-id="5294018354527353443">🛍️</tg-emoji> Blox Fruits Account · MM2 · Blade Ball · Gamepass — ទូទាត់ KHQR ប្រគល់ជូនស្វ័យប្រវត្តិ។\n\n'
        'ចុចប៊ូតុងខាងក្រោមដើម្បីមើលទំនិញ ទិញ និងមើល Order History ទាំងអស់នៅកន្លែងតែមួយ <tg-emoji emoji-id="5470177992950946662">👇</tg-emoji>\n\n'
        '<tg-emoji emoji-id="5987635334945444280">📋</tg-emoji> <b>ឬវាយ Command ទាំងនេះផ្ទាល់:</b>\n'
        '/shop — <tg-emoji emoji-id="5294018354527353443">🛍️</tg-emoji> មើលទំនិញ\n'
        '/myorders — <tg-emoji emoji-id="5987635334945444280">🧾</tg-emoji> មើល Order History\n'
        '/howtobuy — <tg-emoji emoji-id="5462921117423384478">🛒</tg-emoji> របៀបទិញ\n'
        '/howtologin — <tg-emoji emoji-id="6106980145250177382">🔐</tg-emoji> របៀបចូលគណនី\n'
        '/help — <tg-emoji emoji-id="6106980145250177382">💬</tg-emoji> ជំនួយ + ទាក់ទង Admin'
    )
    fallback_text = (
        f"👋 សូមស្វាគមន៍មកកាន់ {STORE_NAME}!\n\n"
        "🛍️ Blox Fruits Account · MM2 · Blade Ball · Gamepass — ទូទាត់ KHQR ប្រគល់ជូនស្វ័យប្រវត្តិ។\n\n"
        "ចុចប៊ូតុងខាងក្រោមដើម្បីមើលទំនិញ ទិញ និងមើល Order History ទាំងអស់នៅកន្លែងតែមួយ 👇\n\n"
        "📋 ឬវាយ Command ទាំងនេះផ្ទាល់:\n"
        "/shop — 🛍️ មើលទំនិញ\n"
        "/myorders — 🧾 មើល Order History\n"
        "/howtobuy — 🛒 របៀបទិញ\n"
        "/howtologin — 🔐 របៀបចូលគណនី\n"
        "/help — 💬 ជំនួយ + ទាក់ទង Admin"
    )
    await _safe_reply(update, html_text, fallback_text, _open_app_keyboard())


async def myorders_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    orders = db.get_orders_by_buyer(update.effective_user.id)
    if not orders:
        html_empty = '<tg-emoji emoji-id="6289745241511565742">📭</tg-emoji> អ្នកមិនទាន់មាន Order ទេ។ បើក Store ដើម្បីចាប់ផ្តើមទិញ <tg-emoji emoji-id="5470177992950946662">👇</tg-emoji>'
        fallback_empty = "📭 អ្នកមិនទាន់មាន Order ទេ។ បើក Store ដើម្បីចាប់ផ្តើមទិញ 👇"
        return await _safe_reply(update, html_empty, fallback_empty, _open_app_keyboard())

    html_text = f'<tg-emoji emoji-id="5987635334945444280">🧾</tg-emoji> អ្នកមាន {len(orders)} Order — មើលលម្អិត (login/password/live code) ក្នុង App <tg-emoji emoji-id="5470177992950946662">👇</tg-emoji>'
    fallback_text = f"🧾 អ្នកមាន {len(orders)} Order — មើលលម្អិត (login/password/live code) ក្នុង App 👇"
    await _safe_reply(update, html_text, fallback_text, _open_app_keyboard())


async def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    html_text = (
        f'<tg-emoji emoji-id="6106980145250177382">💬</tg-emoji> <b>ជំនួយ:</b>\n'
        f'<tg-emoji emoji-id="6001526766714227911">👤</tg-emoji> Admin: @{ADMIN_USERNAME}\n'
        f'<tg-emoji emoji-id="6300742299114541958">📢</tg-emoji> Channel: @{CHANNEL_USERNAME}\n\n'
        '<tg-emoji emoji-id="5987635334945444280">📋</tg-emoji> <b>Command ទាំងអស់:</b>\n'
        '/shop — <tg-emoji emoji-id="5294018354527353443">🛍️</tg-emoji> មើលទំនិញ\n'
        '/myorders — <tg-emoji emoji-id="5987635334945444280">🧾</tg-emoji> Order History\n'
        '/howtobuy — <tg-emoji emoji-id="5462921117423384478">🛒</tg-emoji> របៀបទិញ\n'
        '/howtologin — <tg-emoji emoji-id="6106980145250177382">🔐</tg-emoji> របៀបចូលគណនី\n\n'
        'Warranty និង FAQ ពេញលេញមាននៅក្នុងផ្ទាំង Help របស់ App。'
    )
    fallback_text = (
        f"💬 ជំនួយ:\n"
        f"👤 Admin: @{ADMIN_USERNAME}\n"
        f"📢 Channel: @{CHANNEL_USERNAME}\n\n"
        "📋 Command ទាំងអស់:\n"
        "/shop — 🛍️ មើលទំនិញ\n"
        "/myorders — 🧾 Order History\n"
        "/howtobuy — 🛒 របៀបទិញ\n"
        "/howtologin — 🔐 របៀបចូលគណនី\n\n"
        "Warranty និង FAQ ពេញលេញមាននៅក្នុងផ្ទាំង Help របស់ App。"
    )
    await _safe_reply(update, html_text, fallback_text, _open_app_keyboard())


async def howtobuy_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    html_text = (
        '<tg-emoji emoji-id="5462921117423384478">🛒</tg-emoji> <b>របៀបទិញ:</b>\n\n'
        '<tg-emoji emoji-id="5373145953043767837">1️⃣</tg-emoji> ចុច "បើក Uchiro Store" ខាងក្រោម\n'
        '<tg-emoji emoji-id="5373072212481830225">2️⃣</tg-emoji> ជ្រើសរើសប្រភេទ (Account / MM2 / Fruit / ...)\n'
        '<tg-emoji emoji-id="5373199859345985068">3️⃣</tg-emoji> ចុចលើទំនិញ → ចុច "ទិញឥឡូវ"\n'
        '<tg-emoji emoji-id="5373059438468953535">4️⃣</tg-emoji> Scan KHQR ដើម្បីទូទាត់ → Upload Screenshot\n'
        '<tg-emoji emoji-id="5373024823196809594">5️⃣</tg-emoji> រង់ចាំ Admin បញ្ជាក់ (ជាធម្មតាលឿនណាស់) — នៅពេលបញ្ជាក់រួច គណនី/ទំនិញនឹងផ្ញើមកអោយភ្លាមតាម Bot នេះ\n\n'
        '<tg-emoji emoji-id="5298877105000439431">🏷️</tg-emoji> មាន Coupon? វាយក្នុងទំព័រទូទាត់ មុនពេល Scan QR។'
    )
    fallback_text = (
        "🛒 របៀបទិញ:\n\n"
        "1️⃣ ចុច \"បើក Uchiro Store\" ខាងក្រោម\n"
        "2️⃣ ជ្រើសរើសប្រភេទ (Account / MM2 / Fruit / ...)\n"
        "3️⃣ ចុចលើទំនិញ → ចុច \"ទិញឥឡូវ\"\n"
        "4️⃣ Scan KHQR ដើម្បីទូទាត់ → Upload Screenshot\n"
        "5️⃣ រង់ចាំ Admin បញ្ជាក់ (ជាធម្មតាលឿនណាស់) — នៅពេលបញ្ជាក់រួច គណនី/ទំនិញនឹងផ្ញើមកអោយភ្លាមតាម Bot នេះ\n\n"
        "🏷️ មាន Coupon? វាយក្នុងទំព័រទូទាត់ មុនពេល Scan QR។"
    )
    await _safe_reply(update, html_text, fallback_text, _open_app_keyboard())


async def howtologin_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    html_text = (
        '<tg-emoji emoji-id="5197288647275071607">🔐</tg-emoji> <b>របៀបចូលគណនី (Account ដែលមាន Authenticator):</b>\n\n'
        '<tg-emoji emoji-id="5373145953043767837">1️⃣</tg-emoji> ទាញយក App ឈ្មោះ <b>Google Authenticator</b> ឬ <b>Authy</b> ពី App Store / Play Store\n'
        '<tg-emoji emoji-id="5373072212481830225">2️⃣</tg-emoji> បើក /myorders → ចុច Order → ចុច "មើលគណនីរបស់ខ្ញុំ"\n'
        '<tg-emoji emoji-id="5373199859345985068">3️⃣</tg-emoji> Copy Name និង Password → ចូល Roblox ដោយប្រើវា\n'
        '<tg-emoji emoji-id="5373059438468953535">4️⃣</tg-emoji> Roblox នឹងសួរលេខកូដ 6 ខ្ទង់ → ត្រឡប់មក App វិញ → Copy លេខកូដ Live → បិទភ្ជាប់\n'
        '<tg-emoji emoji-id="5373024823196809594">5️⃣</tg-emoji> លេខកូដប្រែរាល់ 30 វិនាទី — ចុច "Refresh" បើលេខចាស់ហួសពេល\n\n'
        '<tg-emoji emoji-id="6265015769008969527">⚠️</tg-emoji> កុំលុប Authenticator ចោល — បើលុប Warranty នឹងធ្លាក់ពី 14ថ្ងៃ មក 7ថ្ងៃ។'
    )
    fallback_text = (
        "🔐 របៀបចូលគណនី (Account ដែលមាន Authenticator):\n\n"
        "1️⃣ ទាញយក App ឈ្មោះ Google Authenticator ឬ Authy ពី App Store / Play Store\n"
        "2️⃣ បើក /myorders → ចុច Order → ចុច 'មើលគណនីរបស់ខ្ញុំ'\n"
        "3️⃣ Copy Name និង Password → ចូល Roblox ដោយប្រើវា\n"
        "4️⃣ Roblox នឹងសួរលេខកូដ 6 ខ្ទង់ → ត្រឡប់មក App វិញ → Copy លេខកូដ Live → បិទភ្ជាប់\n"
        "5️⃣ លេខកូដប្រែរាល់ 30 វិនាទី — ចុច 'Refresh' បើលេខចាស់ហួសពេល\n\n"
        "⚠️ កុំលុប Authenticator ចោល — បើលុប Warranty នឹងធ្លាក់ពី 14ថ្ងៃ មក 7ថ្ងៃ។"
    )
    await _safe_reply(update, html_text, fallback_text, _open_app_keyboard())


async def _post_init(application: Application):
    await application.bot.set_my_commands([
        BotCommand("start", "🏠 ចាប់ផ្តើម"),
        BotCommand("shop", "🛍️ មើលទំនិញ"),
        BotCommand("myorders", "🧾 Order History"),
        BotCommand("howtobuy", "🛒 របៀបទិញ"),
        BotCommand("howtologin", "🔐 របៀបចូលគណនី"),
        BotCommand("help", "💬 ជំនួយ"),
    ])


def build_app():
    application = Application.builder().token(STORE_BOT_TOKEN).post_init(_post_init).build()
    application.add_handler(CommandHandler("start", start_cmd))
    application.add_handler(CommandHandler("shop", start_cmd))
    application.add_handler(CommandHandler("myorders", myorders_cmd))
    application.add_handler(CommandHandler("orderhistory", myorders_cmd))
    application.add_handler(CommandHandler("help", help_cmd))
    application.add_handler(CommandHandler("support", help_cmd))
    application.add_handler(CommandHandler("howtobuy", howtobuy_cmd))
    application.add_handler(CommandHandler("howtologin", howtologin_cmd))
    return application


if __name__ == "__main__":
    db.init_db()
    build_app().run_polling()
