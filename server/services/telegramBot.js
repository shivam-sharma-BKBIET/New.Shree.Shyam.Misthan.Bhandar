import TelegramBot from 'node-telegram-bot-api';
import Order from '../models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
// Detection for local environment
const isDev = process.env.NODE_ENV !== 'production' || 
              (process.env.BASE_URL && process.env.BASE_URL.includes('localhost')) ||
              !process.env.BASE_URL;

let bot;

if (token && !token.includes('your_bot')) {
  // Singleton Pattern: Prevent multiple polling instances during HMR/Restarts
  if (!global.tgBot) {
    if (isDev) {
      console.log('🤖 Telegram Bot: Starting in POLLING mode (Local Dev/HMR-Safe)');
      global.tgBot = new TelegramBot(token, { polling: true });
    } else {
      console.log('🌐 Telegram Bot: Starting in WEBHOOK mode (Production)');
      global.tgBot = new TelegramBot(token, { polling: false });
    }

    // Centrally handle callback queries (Buttons)
    global.tgBot.on('callback_query', async (callbackQuery) => {
      const { id: callbackQueryId, data, message } = callbackQuery;
      const chatId = message.chat.id;
      const messageId = message.message_id;

      // IMMEDIATE acknowledgment to stop the loading circle on Telegram UI
      try {
        await global.tgBot.answerCallbackQuery(callbackQueryId);
      } catch (err) {
        // Silently skip if answering failed (could be timeout)
      }

      if (!data) return;
      const [action, orderId] = data.split('_');

      try {
        // Validate ObjectId to prevent crash
        if (!orderId || orderId.length !== 24) {
           return;
        }

        const order = await Order.findById(orderId);
        if (!order) {
          await global.tgBot.editMessageText('⚠️ This order record could not be found.', {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: { inline_keyboard: [] }
          });
          return;
        }

        let statusText = '';
        let newStatus = '';

        if (action === 'approve') {
          newStatus = 'VERIFIED';
          statusText = `✅ Approved Order #${order.orderRef}`;
        } else if (action === 'reject') {
          newStatus = 'CANCELLED';
          statusText = `❌ Rejected Order #${order.orderRef}`;
        }

        if (newStatus) {
          order.transactionStatus = newStatus;
          await order.save();
          console.log(`Order ${order.orderRef} status updated to ${newStatus} via Telegram`);
          
          // Remove buttons and show final status
          await global.tgBot.editMessageText(statusText, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: { inline_keyboard: [] }
          });
        }
      } catch (error) {
        console.error('Telegram Callback Error:', error.message);
      }
    });

    // Polling Error Listener - Prevents silent crashes and handles network resets
    global.tgBot.on('polling_error', (error) => {
      if (error.code === 'EFATAL' || error.message.includes('409 Conflict')) {
        // Ignore known conflicts during local dev restarts
        return;
      }
      console.log('📡 Telegram Polling Info:', error.message);
    });
  }
  
  bot = global.tgBot;
}

export default bot;

