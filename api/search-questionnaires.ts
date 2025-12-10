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

    // At least one contact method must be provided and not empty
    const hasTelegram = telegram && typeof telegram === 'string' && telegram.trim() !== '';
    const hasInstagram = instagram && typeof instagram === 'string' && instagram.trim() !== '';
    const hasPhone = phone && typeof phone === 'string' && phone.trim() !== '';

    if (!hasTelegram && !hasInstagram && !hasPhone) {
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

    const normalizedTelegram = hasTelegram ? normalize(telegram.trim()) : '';
    const normalizedInstagram = hasInstagram ? normalize(instagram.trim()) : '';
    const normalizedPhone = hasPhone ? normalize(phone.trim(), true) : '';

    // Find matching questionnaires
    const matches: Array<{
      id: string;
      type: string;
      createdAt: string;
      contactData: any;
    }> = [];

    questionnaires.forEach((questionnaire) => {
      const contact = questionnaire.contactData;
      if (!contact) return;
      
      // Normalize stored contact data
      const qTelegram = contact.telegram ? normalize(String(contact.telegram)) : '';
      const qInstagram = contact.instagram ? normalize(String(contact.instagram)) : '';
      const qPhone = contact.phone ? normalize(String(contact.phone), true) : '';

      // Match if any provided contact method matches
      // For telegram/instagram: exact match after normalization
      const matchesTelegram = normalizedTelegram && qTelegram && qTelegram === normalizedTelegram;
      const matchesInstagram = normalizedInstagram && qInstagram && qInstagram === normalizedInstagram;
      
      // For phone: try multiple matching strategies
      let matchesPhone = false;
      if (normalizedPhone && qPhone) {
        // Exact match
        if (qPhone === normalizedPhone) {
          matchesPhone = true;
        } else {
          // Remove + from both and compare
          const qPhoneNoPlus = qPhone.replace(/^\+/, '');
          const searchPhoneNoPlus = normalizedPhone.replace(/^\+/, '');
          if (qPhoneNoPlus === searchPhoneNoPlus && qPhoneNoPlus.length > 0) {
            matchesPhone = true;
          }
        }
      }

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

