"""
services.py — Uchiro Store
Order approve/reject logic shared between the Admin Mini App's API
route and the Admin Bot's inline Approve/Reject buttons, so both
paths do exactly the same thing and can't drift apart.
"""

import asyncio
from telegram import Bot

import database as db
import utils
from config import STORE_BOT_TOKEN, ADMIN_USERNAME


def _send_telegram_message(chat_id, text):
    async def _send():
        bot = Bot(token=STORE_BOT_TOKEN)
        try:
            await bot.send_message(chat_id=chat_id, text=text, parse_mode="HTML")
        except Exception as e:
            print(f"[notify] failed to message {chat_id}: {e}")
    try:
        asyncio.run(_send())
    except RuntimeError:
        import threading
        threading.Thread(target=lambda: asyncio.run(_send())).start()


def approve_order(order_id) -> bool:
    order = db.get_order(order_id)
    if not order or order["status"] != "pending":
        return False
    item = db.get_item(order["item_id"])
    if not item:
        return False

    db.set_order_approved(order_id)
    db.decrement_stock(order["item_id"])
    if order.get("coupon_code"):
        db.redeem_coupon(order["coupon_code"], order["buyer_chat_id"], order_id)

    msg = f'<tg-emoji emoji-id="6107318416874410520">🎉</tg-emoji> ការទូទាត់សម្រាប់ <b>{item["name"]}</b> ត្រូវបានអនុម័ត!\n\n' + utils.build_delivery_message(item)
    _send_telegram_message(order["buyer_chat_id"], msg)
    return True


def reject_order(order_id) -> bool:
    order = db.get_order(order_id)
    if not order or order["status"] != "pending":
        return False
    db.update_order_status(order_id, "rejected")
    item = db.get_item(order["item_id"])
    _send_telegram_message(
        order["buyer_chat_id"],
        f'<tg-emoji emoji-id="6300696192640620174">❌</tg-emoji> ការទូទាត់សម្រាប់ {item["name"] if item else ""} មិនត្រូវបានអនុម័តទេ។ សូមទាក់ទង @{ADMIN_USERNAME}',
    )
    return True


def poll_pending_khqr_orders():
    """Checks Bakong for every pending order that has a khqr_md5 hash, and
    auto-approves + delivers any that have been paid. This is what makes
    auto-confirm actually work even when the buyer has closed the app —
    api_order_status() alone only checks while someone's screen is open."""
    for order in db.list_orders(status="pending"):
        if not order.get("khqr_md5"):
            continue
        try:
            if utils.check_khqr_paid(order["khqr_md5"]):
                approve_order(order["id"])
        except Exception as e:
            print(f"[khqr-poll] order {order['id']} check failed: {e}")


def start_khqr_background_poller(interval_seconds=20):
    """Starts a daemon thread that calls poll_pending_khqr_orders() on a
    fixed interval, for as long as the process runs. Safe to call more
    than once (e.g. if both main.py and webapp_server.py import this
    module) — only the first call actually starts the loop. A no-op cost
    when BAKONG_API_TOKEN isn't set, since check_khqr_paid() returns
    immediately without hitting the network in that case."""
    import threading
    import time as _time
    if getattr(start_khqr_background_poller, "_started", False):
        return
    start_khqr_background_poller._started = True

    def _loop():
        while True:
            try:
                poll_pending_khqr_orders()
            except Exception as e:
                print(f"[khqr-poll] loop error: {e}")
            _time.sleep(interval_seconds)

    threading.Thread(target=_loop, daemon=True).start()


def notify_admins_new_order(owner_ids, order_id, item, final_price):
    from telegram import InlineKeyboardMarkup, InlineKeyboardButton
    from config import ADMIN_BOT_TOKEN

    kb = InlineKeyboardMarkup([[
        InlineKeyboardButton("✅ អនុម័ត", callback_data=f"appr_{order_id}"),
        InlineKeyboardButton("❌ បដិសេធ", callback_data=f"rej_{order_id}"),
    ]])
    text = (
        f'<tg-emoji emoji-id="6147506120920405501">🆕</tg-emoji> Order #{order_id}\n'
        f'<tg-emoji emoji-id="5854908544712707500">📦</tg-emoji> {item["name"]}\n'
        f'<tg-emoji emoji-id="6301016442582081020">💵</tg-emoji> ${final_price}'
    )

    async def _send_all():
        bot = Bot(token=ADMIN_BOT_TOKEN)
        for admin_id in owner_ids:
            try:
                if item.get("photo_path"):
                    pass
                await bot.send_message(chat_id=admin_id, text=text, parse_mode="HTML", reply_markup=kb)
            except Exception as e:
                print(f"[notify] failed to message admin {admin_id}: {e}")

    try:
        asyncio.run(_send_all())
    except RuntimeError:
        import threading
        threading.Thread(target=lambda: asyncio.run(_send_all())).start()
