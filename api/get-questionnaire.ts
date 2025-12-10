import type { VercelRequest, VercelResponse } from '@vercel/node';
import { questionnaires } from './save-questionnaire';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
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

    return res.status(200).json({ 
      success: true, 
      data: {
        ...questionnaire,
        telegramMessageId: questionnaire.telegramMessageId,
      }
    });
  } catch (error: any) {
    console.error('Error getting questionnaire:', error);
    return res.status(500).json({ 
      error: 'Failed to get questionnaire',
      message: error.message 
    });
  }
}

