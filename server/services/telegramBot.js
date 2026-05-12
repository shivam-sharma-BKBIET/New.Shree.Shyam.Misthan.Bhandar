import TelegramBot from 'node-telegram-bot-api';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { sendPaymentVerifiedEmail, sendPaymentRejectedEmail } from './emailService.js';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
// Detection for production environment (Render/Vercel)
const isDev = process.env.NODE_ENV !== 'production';

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
      
      // Auto-set Webhook in production
      const baseUrl = process.env.BASE_URL;
      if (baseUrl && !baseUrl.includes('localhost')) {
        const webhookUrl = `${baseUrl}/api/telegram/webhook`;
        global.tgBot.setWebHook(webhookUrl)
          .then(() => console.log(`✅ Telegram Webhook set to: ${webhookUrl}`))
          .catch(err => console.error('❌ Telegram Webhook Error:', err.message));
      } else {
        console.warn('⚠️ [TELEGRAM WARNING] BASE_URL not set for production webhook! Buttons will NOT work.');
      }
    }

    // Centrally handle callback queries (Buttons)
    global.tgBot.on('callback_query', async (callbackQuery) => {
      const { id: callbackQueryId, data, message } = callbackQuery;
      const chatId = message.chat.id;
      const messageId = message.message_id;

      /* Removed immediate acknowledgment to allow custom status message later */

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
          newStatus = 'PAYMENT_VERIFIED';
          statusText = `✅ Payment APPROVED\nOrder #${order.orderRef} | ₹${order.totalAmount}`;
        } else if (action === 'reject') {
          newStatus = 'PAYMENT_REJECTED';
          statusText = `❌ Payment REJECTED\nOrder #${order.orderRef} | ₹${order.totalAmount}`;
        }

        if (newStatus) {
          order.transactionStatus = newStatus;
          await order.save();
          console.log(`Order ${order.orderRef} status updated to ${newStatus} via Telegram`);

          // IMMEDIATE UI UPDATE: Remove buttons and show final status before doing slow tasks (emails)
          try {
            await global.tgBot.editMessageText(statusText, {
              chat_id: chatId,
              message_id: messageId,
              parse_mode: 'Markdown',
              reply_markup: { inline_keyboard: [] }
            });
            // Success alert on top of Telegram UI
            await global.tgBot.answerCallbackQuery(callbackQueryId, { text: `Order ${order.orderRef} ${newStatus.replace('_', ' ')}!` });
          } catch (editErr) {
            console.error('Telegram Edit UI Error:', editErr.message);
          }

          // 📧 Send email to customer (Async - Don't wait for this to finish UI update)
          User.findById(order.userId).select('email').then(async (user) => {
            if (user?.email) {
              try {
                if (newStatus === 'PAYMENT_VERIFIED') {
                  await sendPaymentVerifiedEmail(user.email, order);
                  console.log(`✅ Verified email sent to ${user.email}`);
                } else if (newStatus === 'PAYMENT_REJECTED') {
                  await sendPaymentRejectedEmail(user.email, order);
                  console.log(`❌ Rejected email sent to ${user.email}`);
                }
              } catch (emailErr) {
                console.error('📧 Email send failed:', emailErr.message);
              }
            }
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

