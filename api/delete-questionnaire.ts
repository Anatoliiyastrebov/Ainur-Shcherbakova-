import type { VercelRequest, VercelResponse } from '@vercel/node';
import { questionnaires } from './save-questionnaire';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
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

