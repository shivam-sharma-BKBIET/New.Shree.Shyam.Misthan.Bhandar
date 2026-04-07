import express from 'express';
import bot from '../services/telegramBot.js';

const router = express.Router();

// Webhook endpoint: POST /api/telegram/webhook
// This is used in production (webhook mode) to receive updates.
router.post('/webhook', async (req, res) => {
  try {
    if (bot && !bot.options.polling) {
      // Process incoming update from Telegram
      bot.processUpdate(req.body);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Telegram Webhook Error:', error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

