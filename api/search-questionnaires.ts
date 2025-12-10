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
    const { telegram, instagram, phone } = req.body;

    // At least one contact method must be provided
    if (!telegram && !instagram && !phone) {
      return res.status(400).json({ error: 'At least one contact method is required' });
    }

    // Normalize search values (remove @ and spaces)
    const normalize = (value: string) => {
      if (!value) return '';
      return value.replace(/^@/, '').trim().toLowerCase();
    };

    const normalizedTelegram = normalize(telegram || '');
    const normalizedInstagram = normalize(instagram || '');
    const normalizedPhone = normalize(phone || '');

    // Find matching questionnaires
    const matches: Array<{
      id: string;
      type: string;
      createdAt: string;
      contactData: any;
    }> = [];

    questionnaires.forEach((questionnaire) => {
      const contact = questionnaire.contactData;
      
      const qTelegram = normalize(contact.telegram || '');
      const qInstagram = normalize(contact.instagram || '');
      const qPhone = normalize(contact.phone || '');

      // Match if any provided contact method matches
      const matchesTelegram = normalizedTelegram && qTelegram && qTelegram === normalizedTelegram;
      const matchesInstagram = normalizedInstagram && qInstagram && qInstagram === normalizedInstagram;
      const matchesPhone = normalizedPhone && qPhone && qPhone === normalizedPhone;

      if (matchesTelegram || matchesInstagram || matchesPhone) {
        matches.push({
          id: questionnaire.id,
          type: questionnaire.type,
          createdAt: questionnaire.createdAt,
          contactData: {
            telegram: contact.telegram,
            instagram: contact.instagram,
            phone: contact.phone,
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
    console.error('Error searching questionnaires:', error);
    return res.status(500).json({ 
      error: 'Failed to search questionnaires',
      message: error.message 
    });
  }
}

