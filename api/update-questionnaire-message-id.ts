import type { VercelRequest, VercelResponse } from '@vercel/node';
import { questionnaires } from './save-questionnaire';

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
    const { id, telegramMessageId } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Questionnaire ID is required' });
    }

    if (!telegramMessageId || typeof telegramMessageId !== 'number') {
      return res.status(400).json({ error: 'Telegram message ID is required' });
    }

    const questionnaire = questionnaires.get(id);

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    // Update message_id
    questionnaire.telegramMessageId = telegramMessageId;
    questionnaires.set(id, questionnaire);

    return res.status(200).json({ 
      success: true, 
      message: 'Message ID updated successfully' 
    });
  } catch (error: any) {
    console.error('Error updating message ID:', error);
    return res.status(500).json({ 
      error: 'Failed to update message ID',
      message: error.message 
    });
  }
}

