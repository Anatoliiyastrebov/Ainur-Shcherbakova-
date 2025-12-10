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

    // Normalize search values (remove @, spaces, and special characters for phone)
    const normalize = (value: string, isPhone = false) => {
      if (!value) return '';
      let normalized = value.replace(/^@/, '').trim().toLowerCase();
      if (isPhone) {
        // Remove all non-digit characters except +
        normalized = normalized.replace(/[^\d+]/g, '');
        // If starts with +, keep it, otherwise remove all + signs
        if (!normalized.startsWith('+')) {
          normalized = normalized.replace(/\+/g, '');
        }
      }
      return normalized;
    };

    const normalizedTelegram = normalize(telegram || '');
    const normalizedInstagram = normalize(instagram || '');
    const normalizedPhone = normalize(phone || '', true);

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
      const qPhone = normalize(contact.phone || '', true);

      // Match if any provided contact method matches
      // For telegram/instagram: exact match after normalization
      // For phone: match if normalized values are equal (handles different formats)
      const matchesTelegram = normalizedTelegram && qTelegram && qTelegram === normalizedTelegram;
      const matchesInstagram = normalizedInstagram && qInstagram && qInstagram === normalizedInstagram;
      const matchesPhone = normalizedPhone && qPhone && qPhone === normalizedPhone;

      // Also try partial matches for phone (in case one has + and other doesn't)
      const matchesPhonePartial = normalizedPhone && qPhone && 
        (qPhone === normalizedPhone || 
         qPhone.replace(/^\+/, '') === normalizedPhone.replace(/^\+/, '') ||
         qPhone === normalizedPhone.replace(/^\+/, '') ||
         qPhone.replace(/^\+/, '') === normalizedPhone);

      if (matchesTelegram || matchesInstagram || matchesPhone || matchesPhonePartial) {
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

