"""
emoji_map.py — Telegram Premium custom emoji IDs
------------------------------------------------------------------
IMPORTANT SCOPE: these IDs only render inside Telegram's own message
UI, via the <tg-emoji emoji-id="..."> HTML tag when a bot sends a
message with parse_mode="HTML". They do NOT work inside the Mini App
webview — that's your own HTML page, not Telegram's message renderer.
The Mini App keeps using plain Unicode emoji (see CATEGORY_EMOJI in
webapp/assets/data.js for that side).

Usage in a bot message:
    from emoji_map import premium
    text = f"{premium('🏠')} Welcome to Uchiro Store!"
    await update.message.reply_text(text, parse_mode="HTML")

If an emoji isn't in the map, premium() just returns it unchanged —
safe to call on any emoji, mapped or not.
------------------------------------------------------------------
"""

EMOJI_IDS = {
    "📦": "5854908544712707500", "🔄": "5346269127059196142", "🏴‍☠️": "5386372293263892965",
    "🧾": "5264959791213586839", "👤": "5258011929993026890", "🎵": "5172447776205702031",
    "🌐": "6107376940098786484", "📢": "6300742299114541958", "📞": "5390947107744008389",
    "📜": "6323096332579899122", "🏠": "5416041192905265756", "🍈": "6084765169940961891",
    "🛍": "5373052667671093676", "🛍️": "5836672976862319297", "🎮": "5319247469165433798",
    "🏃": "5210965493887819972", "💎": "5202189539967267386", "⚔️": "5408935401442267103",
    "🔪": "5242288969550422350", "⚠️": "6265015769008969527", "🛡️": "5251203410396458957",
    "✨": "6140944776691717029", "🔍": "5368460200875418560", "🔒": "5296369303661067030",
    "⏳": "6289745241511565742", "✅": "5904704361182798355", "❌": "6300696192640620174",
    "🎉": "6107318416874410520", "📋": "5987635334945444280", "🛒": "5312361253610475399",
    "🇰🇭": "5294018354527353443", "📖": "5294018354527353443",
    "1️⃣": "5382322671679708881", "2️⃣": "5381990043642502553", "3️⃣": "5381879959335738545",
    "4️⃣": "5382054253403577563", "5️⃣": "5391197405553107640",
    "🎁": "6283073379184415506", "📺": "5355012477883004708", "🔐": "6109136102868652214",
    "🚫": "5240241223632954241", "👋": "5413694143601842851", "📊": "5231200819986047254",
    "📈": "6300854578149593766", "🏷️": "5298877105000439431", "🔴": "6170475670443922913",
    "💬": "6106980145250177382", "👇": "5470177992950946662", "🛠️": "5462921117423384478",
    "👥": "6001526766714227911", "🟢": "6138568461481153914", "❓": "6298557526560479072",
    "📭": "5352896944496728039", "🆕": "6147506120920405501", "💵": "6301016442582081020",
    "📲": "5406809207947142040", "⚡": "6107022708376082350", "🔑": "5420094143089111506",
    "🔓": "6291893425239234198", "👍": "5469770542288478598", "🔈": "5388632425314140043",
    "🚀": "6300989332748506061", "📝": "5837003105228558796", "👑": "5310070232155436036",
    "🎫": "6301052490242597458",
}


def premium(emoji: str) -> str:
    """Wraps an emoji in Telegram's <tg-emoji> HTML tag if we have a
    Premium ID for it. Falls back to the plain emoji unchanged if not
    mapped — always safe to call."""
    eid = EMOJI_IDS.get(emoji)
    if not eid:
        return emoji
    return f'<tg-emoji emoji-id="{eid}">{emoji}</tg-emoji>'


def p(text_with_emoji: str) -> str:
    """Convenience: runs premium() over every mapped emoji found inside
    a longer string, so you can write normal text with normal emoji and
    just wrap the whole thing: p(f"{e}Welcome {name}!") """
    result = text_with_emoji
    for emoji, eid in EMOJI_IDS.items():
        if emoji in result:
            result = result.replace(emoji, f'<tg-emoji emoji-id="{eid}">{emoji}</tg-emoji>')
    return result
