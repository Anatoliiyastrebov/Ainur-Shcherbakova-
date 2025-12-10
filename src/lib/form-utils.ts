import { QuestionnaireSection, QuestionnaireType } from './questionnaire-data';
import { Language, translations } from './translations';

export interface FormData {
  [key: string]: string | string[];
}

export interface FormAdditionalData {
  [key: string]: string;
}

export interface ContactData {
  telegram?: string;
  instagram?: string;
  phone?: string;
}

export interface FormErrors {
  [key: string]: string;
}

// Storage keys
const getStorageKey = (type: QuestionnaireType, lang: Language) => 
  `health_questionnaire_${type}_${lang}`;

// Save form data to localStorage
export const saveFormData = (
  type: QuestionnaireType,
  lang: Language,
  formData: FormData,
  additionalData: FormAdditionalData,
  contactData: ContactData
) => {
  try {
    const data = { formData, additionalData, contactData, timestamp: Date.now() };
    localStorage.setItem(getStorageKey(type, lang), JSON.stringify(data));
  } catch (err) {
    console.error('Error saving form data:', err);
  }
};

// Load form data from localStorage
export const loadFormData = (type: QuestionnaireType, lang: Language) => {
  try {
    const stored = localStorage.getItem(getStorageKey(type, lang));
    if (stored) {
      const data = JSON.parse(stored);
      // Only return if data is less than 24 hours old
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        return {
          formData: data.formData as FormData,
          additionalData: data.additionalData as FormAdditionalData,
          contactData: data.contactData as ContactData,
        };
      }
    }
  } catch (err) {
    console.error('Error loading form data:', err);
  }
  return null;
};

// Clear form data from localStorage
export const clearFormData = (type: QuestionnaireType, lang: Language) => {
  try {
    localStorage.removeItem(getStorageKey(type, lang));
  } catch (err) {
    console.error('Error clearing form data:', err);
  }
};

// Validate form
export const validateForm = (
  sections: QuestionnaireSection[],
  formData: FormData,
  contactData: ContactData,
  lang: Language,
  additionalData?: FormAdditionalData
): FormErrors => {
  const errors: FormErrors = {};
  const t = translations[lang];

  sections.forEach((section) => {
    section.questions.forEach((question) => {
      if (question.required) {
        const value = formData[question.id];
        
        if (question.type === 'checkbox') {
          if (!value || (Array.isArray(value) && value.length === 0)) {
            errors[question.id] = t.selectAtLeastOne;
          }
        } else if (question.type === 'number') {
          if (!value || value === '' || isNaN(Number(value))) {
            errors[question.id] = t.required;
          }
        } else {
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            errors[question.id] = t.required;
          }
        }
      }
    });
  });

  // Special validation: if operations is "yes", additional field is required
  if (formData['operations'] === 'yes' && additionalData) {
    const operationsAdditional = additionalData['operations_additional'];
    if (!operationsAdditional || operationsAdditional.trim() === '') {
      errors['operations_additional'] = t.required;
    }
  }

  // Special validation: if pregnancy_problems is "yes", additional field is required
  if (formData['pregnancy_problems'] === 'yes' && additionalData) {
    const pregnancyProblemsAdditional = additionalData['pregnancy_problems_additional'];
    if (!pregnancyProblemsAdditional || pregnancyProblemsAdditional.trim() === '') {
      errors['pregnancy_problems_additional'] = t.required;
    }
  }

  // Special validation: if injuries has any option selected except "no_issues", additional field is required
  if (formData['injuries'] && additionalData) {
    const injuriesValue = formData['injuries'];
    const injuriesArray = Array.isArray(injuriesValue) ? injuriesValue : [injuriesValue];
    // Check if any option other than "no_issues" is selected
    const hasOtherThanNoIssues = injuriesArray.some((val: string) => val !== 'no_issues');
    if (hasOtherThanNoIssues) {
      const injuriesAdditional = additionalData['injuries_additional'];
      if (!injuriesAdditional || injuriesAdditional.trim() === '') {
        errors['injuries_additional'] = t.required;
      }
    }
  }

  // Special validation: if allergies has "other" selected, additional field is required
  if (formData['allergies'] && additionalData) {
    const allergiesValue = formData['allergies'];
    const allergiesArray = Array.isArray(allergiesValue) ? allergiesValue : [allergiesValue];
    const hasOther = allergiesArray.includes('other');
    if (hasOther) {
      const allergiesAdditional = additionalData['allergies_additional'];
      if (!allergiesAdditional || allergiesAdditional.trim() === '') {
        errors['allergies_additional'] = t.required;
      }
    }
  }

  // Special validation: if skin_condition has "other" selected, additional field is required
  if (formData['skin_condition'] && additionalData) {
    const skinConditionValue = formData['skin_condition'];
    const skinConditionArray = Array.isArray(skinConditionValue) ? skinConditionValue : [skinConditionValue];
    const hasOther = skinConditionArray.includes('other');
    if (hasOther) {
      const skinConditionAdditional = additionalData['skin_condition_additional'];
      if (!skinConditionAdditional || skinConditionAdditional.trim() === '') {
        errors['skin_condition_additional'] = t.required;
      }
    }
  }

  // Special validation: if how_learned is "recommendation", additional field is required
  if (formData['how_learned'] === 'recommendation' && additionalData) {
    const howLearnedAdditional = additionalData['how_learned_additional'];
    if (!howLearnedAdditional || howLearnedAdditional.trim() === '') {
      errors['how_learned_additional'] = t.required;
    }
  }

  // Validate contact - at least one method must be filled
  const hasTelegram = contactData.telegram && contactData.telegram.trim() !== '';
  const hasInstagram = contactData.instagram && contactData.instagram.trim() !== '';
  const hasPhone = contactData.phone && contactData.phone.trim() !== '';
  
  if (!hasTelegram && !hasInstagram && !hasPhone) {
    errors['contact_method'] = t.required;
  }

  return errors;
};

// Generate Markdown
export const generateMarkdown = (
  type: QuestionnaireType,
  sections: QuestionnaireSection[],
  formData: FormData,
  additionalData: FormAdditionalData,
  contactData: ContactData,
  lang: Language
): string => {
  const t = translations[lang];
  const headers = {
    infant: t.mdInfant,
    child: t.mdChild,
    woman: t.mdWoman,
    man: t.mdMan,
  };

  // Escape special characters for HTML (Telegram supports HTML parse mode)
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Start with header
  let html = `<b>${escapeHtml(headers[type])}</b>\n`;

  let questionNumber = 1;
  let digestionQuestionPassed = false;

  sections.forEach((section) => {
    // Skip empty sections
    const hasAnswers = section.questions.some((question) => {
      const value = formData[question.id];
      return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
    });

    if (!hasAnswers) return;

    // Section header
    html += `<b>${escapeHtml(section.title[lang])}</b>\n`;

    section.questions.forEach((question) => {
      const value = formData[question.id];
      const additional = additionalData[`${question.id}_additional`];

      if (value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '')) {
        const label = question.label[lang];
        
        // Question number - start numbering from "digestion" question
        if (question.id === 'digestion') {
          digestionQuestionPassed = true;
          questionNumber = 1;
        }
        
        // Format answer
        let answerText = '';
        if (Array.isArray(value)) {
          const optionLabels = value.map((v) => {
            const opt = question.options?.find((o) => o.value === v);
            return opt ? opt.label[lang] : v;
          });
          answerText = optionLabels.join(', ');
        } else if (question.options) {
          const opt = question.options.find((o) => o.value === value);
          answerText = opt ? opt.label[lang] : value;
        } else {
          answerText = String(value);
        }

        // Question on one line, answer on next line
        if (digestionQuestionPassed) {
          html += `${questionNumber}. <b>${escapeHtml(label)}</b>\n`;
          questionNumber++;
        } else {
          html += `<b>${escapeHtml(label)}</b>\n`;
        }
        
        html += `${escapeHtml(answerText)}`;
        
        // Additional info on same line if present
        if (additional && additional.trim() !== '') {
          html += ` <i>(${escapeHtml(additional.trim())})</i>`;
        }
        
        html += `\n`;
      }
    });
  });

  // Contact section
  const contacts: string[] = [];
  
  if (contactData.telegram && contactData.telegram.trim() !== '') {
    const cleanTelegram = contactData.telegram.replace(/^@/, '').trim();
    const telegramLink = `https://t.me/${cleanTelegram}`;
    contacts.push(`Telegram: @${escapeHtml(cleanTelegram)}\n<a href="${telegramLink}">${escapeHtml(telegramLink)}</a>`);
  }
  
  if (contactData.instagram && contactData.instagram.trim() !== '') {
    const cleanInstagram = contactData.instagram.replace(/^@/, '').trim();
    const instagramLink = `https://instagram.com/${cleanInstagram}`;
    contacts.push(`Instagram: @${escapeHtml(cleanInstagram)}\n<a href="${instagramLink}">${escapeHtml(instagramLink)}</a>`);
  }
  
  if (contactData.phone && contactData.phone.trim() !== '') {
    const cleanPhone = contactData.phone.trim();
    const phoneLink = `tel:${cleanPhone}`;
    const phoneLabel = lang === 'ru' ? 'Телефон' : 'Phone';
    contacts.push(`${phoneLabel}: <a href="${phoneLink}">${escapeHtml(cleanPhone)}</a>`);
  }

  if (contacts.length > 0) {
    html += `<b>${escapeHtml(t.mdContacts)}</b>\n`;
    contacts.forEach((contact) => {
      html += `${contact}\n`;
    });
  }

  return html;
};

// Save questionnaire to backend
export const saveQuestionnaire = async (
  type: QuestionnaireType,
  formData: FormData,
  additionalData: FormAdditionalData,
  contactData: ContactData,
  markdown: string,
  language: Language
): Promise<{ success: boolean; id?: string; error?: string }> => {
  // In development, use localStorage as fallback if API is not available
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;

  try {
    const response = await fetch('/api/save-questionnaire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        formData,
        additionalData,
        contactData,
        markdown,
        language,
      }),
    }).catch((fetchError) => {
      // If fetch fails (e.g., API not available in dev), use localStorage fallback
      if (isDevelopment) {
        console.warn('API not available, using localStorage fallback:', fetchError);
        return null;
      }
      throw fetchError;
    });

    // If response is null (fetch failed in dev), use localStorage
    if (!response) {
      if (isDevelopment) {
        const id = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        try {
          const questionnaireData = {
            id,
            type,
            formData,
            additionalData: additionalData || {},
            contactData,
            markdown,
            createdAt: new Date().toISOString(),
            language: language || 'ru',
          };
          localStorage.setItem(`questionnaire_${id}`, JSON.stringify(questionnaireData));
          
          // Save ID to list
          const savedIds = JSON.parse(localStorage.getItem('submitted_questionnaire_ids') || '[]');
          if (!savedIds.includes(id)) {
            savedIds.push(id);
            localStorage.setItem('submitted_questionnaire_ids', JSON.stringify(savedIds));
          }
          
          return { success: true, id };
        } catch (err) {
          console.error('Error saving to localStorage:', err);
          return { success: false, error: 'Failed to save questionnaire' };
        }
      }
      return { success: false, error: 'API not available' };
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      return { 
        success: false, 
        error: response.statusText || 'Server returned non-JSON response' 
      };
    }

    // Check if response body is empty
    const text = await response.text();
    if (!text || text.trim() === '') {
      console.error('Empty response from server');
      return { 
        success: false, 
        error: 'Empty response from server' 
      };
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError, 'Response text:', text);
      return { 
        success: false, 
        error: 'Invalid JSON response from server' 
      };
    }

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to save questionnaire' };
    }

    // Save questionnaire ID to localStorage
    if (data.id) {
      try {
        const savedIds = JSON.parse(localStorage.getItem('submitted_questionnaire_ids') || '[]');
        if (!savedIds.includes(data.id)) {
          savedIds.push(data.id);
          localStorage.setItem('submitted_questionnaire_ids', JSON.stringify(savedIds));
        }
      } catch (err) {
        console.error('Error saving questionnaire ID to localStorage:', err);
      }
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error('Error saving questionnaire:', error);
    return { success: false, error: error.message || 'Failed to save questionnaire' };
  }
};

// Get all questionnaire IDs from localStorage
export const getSavedQuestionnaireIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('submitted_questionnaire_ids') || '[]');
  } catch (err) {
    console.error('Error loading questionnaire IDs:', err);
    return [];
  }
};

// Remove questionnaire ID from localStorage
export const removeQuestionnaireId = (id: string) => {
  try {
    const savedIds = JSON.parse(localStorage.getItem('submitted_questionnaire_ids') || '[]');
    const filteredIds = savedIds.filter((savedId: string) => savedId !== id);
    localStorage.setItem('submitted_questionnaire_ids', JSON.stringify(filteredIds));
  } catch (err) {
    console.error('Error removing questionnaire ID:', err);
  }
};

// Send to Telegram
// SECURITY NOTE: In production, use environment variables or a server-side proxy
// Do not expose BOT_TOKEN in client-side code in production!
// For development: Set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in .env file
export const sendToTelegram = async (markdown: string): Promise<{ success: boolean; error?: string }> => {
  // Try to get from environment variables first (for Vite: VITE_ prefix)
  const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  // Debug: Log all environment variables (without exposing sensitive data)
  const allViteEnvKeys = Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'));
  console.log('Environment check:', {
    hasToken: !!BOT_TOKEN,
    hasChatId: !!CHAT_ID,
    tokenLength: BOT_TOKEN?.length || 0,
    chatIdLength: CHAT_ID?.length || 0,
    mode: import.meta.env.MODE,
    prod: import.meta.env.PROD,
    dev: import.meta.env.DEV,
    allEnvKeys: allViteEnvKeys,
    allEnvValues: allViteEnvKeys.map(key => ({ key, hasValue: !!import.meta.env[key] }))
  });

  // Validate that tokens are set
  if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.trim() === '' || CHAT_ID.trim() === '') {
    const errorMsg = `Telegram Bot Token or Chat ID not configured. 
    
Please check:
1. Go to Vercel → Project settings → Environment variables
2. Make sure these variables are set:
   - Key: VITE_TELEGRAM_BOT_TOKEN, Value: your_bot_token
   - Key: VITE_TELEGRAM_CHAT_ID, Value: your_chat_id
3. After adding variables, redeploy your site
4. Wait for the build to complete

Current status:
- VITE_TELEGRAM_BOT_TOKEN: ${BOT_TOKEN ? 'SET' : 'NOT SET'}
- VITE_TELEGRAM_CHAT_ID: ${CHAT_ID ? 'SET' : 'NOT SET'}
- All VITE_ variables found: ${allViteEnvKeys.join(', ') || 'NONE'}`;
    
    console.error('Environment variables check failed:', {
      BOT_TOKEN: BOT_TOKEN ? 'SET (hidden)' : 'NOT SET',
      CHAT_ID: CHAT_ID ? 'SET (hidden)' : 'NOT SET',
      allViteEnvKeys,
      mode: import.meta.env.MODE
    });
    return { success: false, error: errorMsg };
  }

  // Log payload for debugging
  console.log('Sending to Telegram...', { 
    chatId: CHAT_ID.substring(0, 4) + '...', 
    textLength: markdown.length,
    hasToken: !!BOT_TOKEN,
    hasChatId: !!CHAT_ID
  });

  // Create AbortController for timeout
  const controller = new AbortController();
  let timeoutId: NodeJS.Timeout | null = null;

  try {
    timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: markdown,
          parse_mode: 'HTML',
        }),
        signal: controller.signal,
      }
    );

    if (timeoutId) clearTimeout(timeoutId);

    // Check if response has content
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response from Telegram:', text);
      return { 
        success: false, 
        error: 'Invalid response from Telegram API' 
      };
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      console.error('Empty response from Telegram API');
      return { 
        success: false, 
        error: 'Empty response from Telegram API' 
      };
    }

    try {
      responseData = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Telegram response:', parseError, 'Response text:', text);
      return { 
        success: false, 
        error: 'Invalid JSON response from Telegram API' 
      };
    }

    if (!response.ok) {
      const errorMsg = responseData.description || `HTTP ${response.status}`;
      console.error('Telegram API error:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData
      });
      return { 
        success: false, 
        error: `Telegram API error: ${errorMsg}` 
      };
    }

    if (!responseData.ok) {
      const errorMsg = responseData.description || 'Unknown Telegram API error';
      console.error('Telegram API returned error:', responseData);
      return { 
        success: false, 
        error: `Telegram API error: ${errorMsg}` 
      };
    }

    console.log('Successfully sent to Telegram');
    return { success: true };
  } catch (error: any) {
    if (timeoutId) clearTimeout(timeoutId);
    
    let errorMessage = 'Unknown error occurred';
    
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout. Please check your internet connection and try again.';
    } else if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.error('Error sending to Telegram:', {
      error,
      message: errorMessage,
      name: error?.name,
      stack: error?.stack
    });
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};
