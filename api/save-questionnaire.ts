import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';

interface QuestionnaireData {
  id: string;
  type: string;
  formData: any;
  additionalData: any;
  contactData: any;
  markdown: string;
  createdAt: string;
  language: string;
  telegramMessageId?: number;
}

// In-memory storage (for development)
// In production, use a database like Vercel KV, MongoDB, etc.
const questionnaires: Map<string, QuestionnaireData> = new Map();

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
    const { type, formData, additionalData, contactData, markdown, language, telegramMessageId } = req.body;

    if (!type || !formData || !contactData || !markdown) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate unique ID
    const id = uuidv4();

    // Save questionnaire
    const questionnaire: QuestionnaireData = {
      id,
      type,
      formData,
      additionalData: additionalData || {},
      contactData,
      markdown,
      createdAt: new Date().toISOString(),
      language: language || 'ru',
      telegramMessageId: telegramMessageId || undefined,
    };

    questionnaires.set(id, questionnaire);

    return res.status(200).json({ 
      success: true, 
      id,
      telegramMessageId: questionnaire.telegramMessageId,
      message: 'Questionnaire saved successfully'
    });
  } catch (error: any) {
    console.error('Error saving questionnaire:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to save questionnaire',
      message: error.message 
    });
  }
}

// Export questionnaires map for other API routes
export { questionnaires };

