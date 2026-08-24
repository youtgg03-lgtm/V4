"""
main.py — Uchiro Store
Runs the Store Bot, Admin Bot, and the Flask web server together.
"""

import asyncio
import threading
import logging

import database as db
import store_bot
import admin_bot
from webapp_server import app as flask_app
from config import PORT, STORE_BOT_TOKEN, ADMIN_BOT_TOKEN, WEBAPP_URL

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(message)s")
log = logging.getLogger("main")


def run_flask():
    log.info(f"Web server starting on 0.0.0.0:{PORT}")
    flask_app.run(host="0.0.0.0", port=PORT, debug=False, use_reloader=False)


async def run_bots():
    apps = []
    if STORE_BOT_TOKEN:
        apps.append(("store_bot", store_bot.build_app()))
    else:
        log.warning("STORE_BOT_TOKEN not set — store bot disabled")

    if ADMIN_BOT_TOKEN:
        apps.append(("admin_bot", admin_bot.build_app()))
    else:
        log.warning("ADMIN_BOT_TOKEN not set — admin bot disabled")

    if not apps:
        log.error("No bot tokens configured — only the web server will run.")
        while True:
            await asyncio.sleep(3600)

    for name, application in apps:
        await application.initialize()
        await application.start()
        await application.updater.start_polling(drop_pending_updates=True)
        log.info(f"{name} polling started")

    try:
        await asyncio.Event().wait()
    finally:
        for name, application in apps:
            if application.updater and application.updater.running:
                await application.updater.stop()
            await application.stop()
            await application.shutdown()


def main():
    db.init_db()
    if not WEBAPP_URL:
        log.warning("WEBAPP_URL not set.")

    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()

    asyncio.run(run_bots())


if __name__ == "__main__":
    main()
