import type { VercelRequest, VercelResponse } from '@vercel/node';
import { questionnaires } from './save-questionnaire';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Questionnaire ID is required' });
    }

    const questionnaire = questionnaires.get(id);

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    // Delete from Telegram if message_id exists
    const messageId = questionnaire.telegramMessageId;
    if (messageId) {
      const BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
      const CHAT_ID = process.env.VITE_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

      if (BOT_TOKEN && CHAT_ID) {
        try {
          const telegramResponse = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chat_id: CHAT_ID,
                message_id: messageId,
              }),
            }
          );

          if (telegramResponse.ok) {
            console.log(`Successfully deleted Telegram message ${messageId} for questionnaire ${id}`);
          } else {
            const errorData = await telegramResponse.json().catch(() => ({}));
            console.warn(`Failed to delete Telegram message ${messageId}:`, errorData);
            // Continue with questionnaire deletion even if Telegram delete fails
          }
        } catch (telegramError) {
          console.error('Error deleting Telegram message:', telegramError);
          // Continue with questionnaire deletion even if Telegram delete fails
        }
      }
    }

    questionnaires.delete(id);

    return res.status(200).json({ 
      success: true, 
      message: 'Questionnaire deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting questionnaire:', error);
    return res.status(500).json({ 
      error: 'Failed to delete questionnaire',
      message: error.message 
    });
  }
}

