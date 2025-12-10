import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messageId } = req.body;

    if (!messageId || typeof messageId !== 'number') {
      return res.status(400).json({ 
        success: false,
        error: 'Message ID is required and must be a number' 
      });
    }

    const BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.VITE_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Telegram credentials not configured');
      return res.status(500).json({ 
        success: false,
        error: 'Telegram credentials not configured' 
      });
    }

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

      if (!telegramResponse.ok) {
        const errorData = await telegramResponse.json().catch(() => ({}));
        const errorMsg = errorData.description || `HTTP ${telegramResponse.status}`;
        console.error(`Failed to delete Telegram message ${messageId}:`, errorMsg);
        return res.status(200).json({ 
          success: false, 
          error: errorMsg 
        });
      }

      const result = await telegramResponse.json();
      
      if (!result.ok) {
        const errorMsg = result.description || 'Unknown error';
        console.error(`Telegram API error for message ${messageId}:`, errorMsg);
        return res.status(200).json({ 
          success: false, 
          error: errorMsg 
        });
      }

      console.log(`Successfully deleted Telegram message ${messageId}`);
      return res.status(200).json({ 
        success: true,
        message: 'Telegram message deleted successfully' 
      });
    } catch (telegramError: any) {
      console.error('Error deleting Telegram message:', telegramError);
      return res.status(500).json({ 
        success: false,
        error: telegramError.message || 'Failed to delete Telegram message' 
      });
    }
  } catch (error: any) {
    console.error('Error in delete-telegram-message handler:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to process request',
      message: error.message 
    });
  }
}

