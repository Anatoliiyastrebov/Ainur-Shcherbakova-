import React, { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Instagram, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
  contactMethod: 'telegram' | 'instagram';
  username: string;
  error?: string;
  onMethodChange: (method: 'telegram' | 'instagram') => void;
  onUsernameChange: (username: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactMethod,
  username,
  error,
  onMethodChange,
  onUsernameChange,
}) => {
  const { t } = useLanguage();

  const cleanUsername = useMemo(() => {
    return username.replace(/^@/, '').trim();
  }, [username]);

  const contactLink = useMemo(() => {
    if (!cleanUsername) return '';
    return contactMethod === 'telegram'
      ? `https://t.me/${cleanUsername}`
      : `https://instagram.com/${cleanUsername}`;
  }, [contactMethod, cleanUsername]);

  return (
    <div className="card-wellness space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        {t('contactMethod')}
      </h3>

      <div className="flex gap-3">
        <label
          className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all flex-1 justify-center ${
            contactMethod === 'telegram'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          <input
            type="radio"
            name="contactMethod"
            value="telegram"
            checked={contactMethod === 'telegram'}
            onChange={() => onMethodChange('telegram')}
            className="sr-only"
          />
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">{t('telegram')}</span>
        </label>

        <label
          className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all flex-1 justify-center ${
            contactMethod === 'instagram'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          <input
            type="radio"
            name="contactMethod"
            value="instagram"
            checked={contactMethod === 'instagram'}
            onChange={() => onMethodChange('instagram')}
            className="sr-only"
          />
          <Instagram className="w-5 h-5" />
          <span className="font-medium">{t('instagram')}</span>
        </label>
      </div>

      <div>
        <label className="text-sm text-muted-foreground mb-1 block">
          {t('username')} <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          className={`input-field ${error ? 'input-error' : ''}`}
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder={t('usernameHint')}
        />
        {error && (
          <p className="error-message mt-1">
            <AlertCircleIcon />
            {error}
          </p>
        )}
      </div>

      {cleanUsername && (
        <div className="bg-accent/50 rounded-xl p-3">
          <p className="text-sm text-muted-foreground mb-1">{t('contactLink')}</p>
          <a
            href={contactLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium flex items-center gap-1 hover:underline break-all"
          >
            {contactLink}
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
          </a>
        </div>
      )}
    </div>
  );
};

const AlertCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
