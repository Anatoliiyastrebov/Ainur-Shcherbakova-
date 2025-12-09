import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { QuestionField } from '@/components/form/QuestionField';
import { ContactSection } from '@/components/form/ContactSection';
import { DSGVOCheckbox } from '@/components/form/DSGVOCheckbox';
import { MarkdownPreview } from '@/components/form/MarkdownPreview';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionIcon } from '@/components/icons/SectionIcons';
import {
  getQuestionnaire,
  getQuestionnaireTitle,
  QuestionnaireType,
} from '@/lib/questionnaire-data';
import {
  FormData,
  FormAdditionalData,
  ContactData,
  FormErrors,
  validateForm,
  generateMarkdown,
  saveFormData,
  loadFormData,
  clearFormData,
  sendToTelegram,
} from '@/lib/form-utils';
import { Eye, Send, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Anketa: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const type = (searchParams.get('type') as QuestionnaireType) || 'infant';
  const sections = useMemo(() => getQuestionnaire(type), [type]);
  const title = getQuestionnaireTitle(type, language);

  // Check if environment variables are configured
  const isEnvConfigured = useMemo(() => {
    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    return !!(BOT_TOKEN && CHAT_ID && BOT_TOKEN.trim() !== '' && CHAT_ID.trim() !== '');
  }, []);

  const [formData, setFormData] = useState<FormData>({});
  const [additionalData, setAdditionalData] = useState<FormAdditionalData>({});
  const [contactData, setContactData] = useState<ContactData>({
    telegram: '',
    instagram: '',
    phone: '',
  });
  const [dsgvoAccepted, setDsgvoAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load saved form data on mount
  useEffect(() => {
    const saved = loadFormData(type, language);
    if (saved) {
      setFormData(saved.formData);
      setAdditionalData(saved.additionalData);
      setContactData(saved.contactData);
    }
  }, [type, language]);

  // Auto-save form data
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveFormData(type, language, formData, additionalData, contactData);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData, additionalData, contactData, type, language]);

  const handleFieldChange = (questionId: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
    // If operations changed to "no", clear additional field error
    if (questionId === 'operations' && value === 'no') {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors['operations_additional'];
        return newErrors;
      });
    }
    // If pregnancy_problems changed to "no", clear additional field error
    if (questionId === 'pregnancy_problems' && value === 'no') {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors['pregnancy_problems_additional'];
        return newErrors;
      });
    }
    // If injuries changed to only "no_issues" or empty, clear additional field error
    if (questionId === 'injuries') {
      const injuriesArray = Array.isArray(value) ? value : [value];
      const hasOtherThanNoIssues = injuriesArray.some((val: string) => val !== 'no_issues');
      if (!hasOtherThanNoIssues) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['injuries_additional'];
          return newErrors;
        });
      }
    }
    // If allergies changed and "other" is not selected, clear additional field error
    if (questionId === 'allergies') {
      const allergiesArray = Array.isArray(value) ? value : [value];
      const hasOther = allergiesArray.includes('other');
      if (!hasOther) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['allergies_additional'];
          return newErrors;
        });
      }
    }
    // If skin_condition changed and "other" is not selected, clear additional field error
    if (questionId === 'skin_condition') {
      const skinConditionArray = Array.isArray(value) ? value : [value];
      const hasOther = skinConditionArray.includes('other');
      if (!hasOther) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['skin_condition_additional'];
          return newErrors;
        });
      }
    }
    // If how_learned changed and "recommendation" is not selected, clear additional field and error
    if (questionId === 'how_learned') {
      if (value !== 'recommendation') {
        setAdditionalData((prev) => {
          const newData = { ...prev };
          delete newData['how_learned_additional'];
          return newData;
        });
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors['how_learned_additional'];
          return newErrors;
        });
      }
    }
  };

  const handleAdditionalChange = (questionId: string, value: string) => {
    setAdditionalData((prev) => ({ ...prev, [`${questionId}_additional`]: value }));
    // Clear error when user starts typing in additional field
    const additionalKey = `${questionId}_additional`;
    if (errors[additionalKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[additionalKey];
        return newErrors;
      });
    }
  };

  const handleClearForm = () => {
    setFormData({});
    setAdditionalData({});
    setContactData({ telegram: '', instagram: '', phone: '' });
    setDsgvoAccepted(false);
    setErrors({});
    clearFormData(type, language);
    toast.success(language === 'ru' ? 'Форма очищена' : 'Form cleared');
  };

  const markdown = useMemo(() => {
    return generateMarkdown(type, sections, formData, additionalData, contactData, language);
  }, [type, sections, formData, additionalData, contactData, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(sections, formData, contactData, language, additionalData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error(t('required'));
      // Scroll to first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!dsgvoAccepted) {
      toast.error(language === 'ru' ? 'Необходимо принять условия DSGVO' : 'You must accept GDPR terms');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendToTelegram(markdown);
      
      if (result.success) {
        clearFormData(type, language);
        navigate(`/success?lang=${language}`);
      } else {
        // Show detailed error message
        const errorMsg = result.error || t('submitError');
        console.error('Failed to send form:', errorMsg);
        toast.error(errorMsg, {
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      const errorMsg = error?.message || t('submitError');
      toast.error(errorMsg, {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground text-center mb-8 animate-fade-in">
          {title}
        </h1>

        {!isEnvConfigured && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {language === 'ru' 
                ? 'Переменные окружения не настроены' 
                : 'Environment variables not configured'}
            </AlertTitle>
            <AlertDescription>
              {language === 'ru' 
                ? 'Telegram Bot Token или Chat ID не настроены. Пожалуйста, настройте переменные окружения VITE_TELEGRAM_BOT_TOKEN и VITE_TELEGRAM_CHAT_ID в Vercel и пересоберите сайт.'
                : 'Telegram Bot Token or Chat ID not configured. Please set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID environment variables in Vercel and rebuild the site.'}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className="card-wellness space-y-6"
              style={{ animationDelay: `${sectionIndex * 0.1}s` }}
            >
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <SectionIcon name={section.icon} className="w-6 h-6 text-primary" />
                {section.title[language]}
              </h2>

              <div className="space-y-6">
                {section.questions.map((question) => (
                  <div
                    key={question.id}
                    data-error={!!errors[question.id]}
                  >
                    <QuestionField
                      question={question}
                      value={formData[question.id] || (question.type === 'checkbox' ? [] : '')}
                      additionalValue={additionalData[`${question.id}_additional`] || ''}
                      error={errors[question.id]}
                      additionalError={errors[`${question.id}_additional`]}
                      onChange={(value) => handleFieldChange(question.id, value)}
                      onAdditionalChange={(value) =>
                        handleAdditionalChange(question.id, value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Section */}
          <ContactSection
            contactData={contactData}
            errors={{
              telegram: errors['contact_telegram'],
              instagram: errors['contact_instagram'],
              phone: errors['contact_phone'],
              contact_method: errors['contact_method'],
            }}
            onTelegramChange={(value) => {
              setContactData((prev) => ({ ...prev, telegram: value }));
              // Clear contact_method error if any field is filled
              if (value.trim() !== '' || contactData.instagram?.trim() || contactData.phone?.trim()) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors['contact_method'];
                  delete newErrors['contact_telegram'];
                  return newErrors;
                });
              }
            }}
            onInstagramChange={(value) => {
              setContactData((prev) => ({ ...prev, instagram: value }));
              // Clear contact_method error if any field is filled
              if (value.trim() !== '' || contactData.telegram?.trim() || contactData.phone?.trim()) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors['contact_method'];
                  delete newErrors['contact_instagram'];
                  return newErrors;
                });
              }
            }}
            onPhoneChange={(value) => {
              setContactData((prev) => ({ ...prev, phone: value }));
              // Clear contact_method error if any field is filled
              if (value.trim() !== '' || contactData.telegram?.trim() || contactData.instagram?.trim()) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors['contact_method'];
                  delete newErrors['contact_phone'];
                  return newErrors;
                });
              }
            }}
          />

          {/* DSGVO Checkbox */}
          <DSGVOCheckbox checked={dsgvoAccepted} onChange={setDsgvoAccepted} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="btn-secondary flex items-center justify-center gap-2 flex-1"
            >
              <Eye className="w-5 h-5" />
              {t('previewMarkdown')}
            </button>

            <button
              type="button"
              onClick={handleClearForm}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              {t('clearForm')}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!dsgvoAccepted || isSubmitting || !isEnvConfigured}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('submit')}
              </>
            )}
          </button>
        </form>

        {/* Markdown Preview Modal */}
        {showPreview && (
          <MarkdownPreview markdown={markdown} onClose={() => setShowPreview(false)} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Anketa;
