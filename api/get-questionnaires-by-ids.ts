import type { VercelRequest, VercelResponse } from '@vercel/node';
import { questionnaires } from './save-questionnaire';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(200).json({ 
        success: true, 
        count: 0,
        questionnaires: []
      });
    }

    // Find questionnaires by IDs
    const matches: Array<{
      id: string;
      type: string;
      createdAt: string;
      contactData: any;
    }> = [];

    ids.forEach((id: string) => {
      const questionnaire = questionnaires.get(id);
      if (questionnaire) {
        matches.push({
          id: questionnaire.id,
          type: questionnaire.type,
          createdAt: questionnaire.createdAt,
          contactData: {
            telegram: questionnaire.contactData?.telegram,
            instagram: questionnaire.contactData?.instagram,
            phone: questionnaire.contactData?.phone,
          },
        });
      }
    });

    // Sort by creation date (newest first)
    matches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.status(200).json({ 
      success: true, 
      count: matches.length,
      questionnaires: matches
    });
  } catch (error: any) {
    console.error('Error getting questionnaires by IDs:', error);
    return res.status(500).json({ 
      error: 'Failed to get questionnaires',
      message: error.message 
    });
  }
}

