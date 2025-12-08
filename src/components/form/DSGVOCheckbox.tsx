import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, Info } from 'lucide-react';
import { PrivacyPolicyDialog } from './PrivacyPolicyDialog';

interface DSGVOCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const DSGVOCheckbox: React.FC<DSGVOCheckboxProps> = ({ checked, onChange }) => {
  const { t, language } = useLanguage();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const privacyPolicyLink = {
    ru: 'Политика конфиденциальности',
    en: 'Privacy Policy',
  };

  const userRightsNotice = {
    ru: 'Вы имеете право на доступ, исправление, удаление и ограничение обработки ваших данных в соответствии с GDPR.',
    en: 'You have the right to access, correct, delete, and restrict processing of your data in accordance with GDPR.',
  };

  return (
    <>
      <div className="bg-accent/30 rounded-2xl p-5 border border-border space-y-4">
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-6 h-6 rounded-lg border-2 border-input bg-background peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
            {checked && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">DSGVO / GDPR</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('dsgvoConsent')}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowPrivacyPolicy(true);
              }}
              className="text-primary hover:underline text-sm mt-2 font-medium"
            >
              {privacyPolicyLink[language]}
            </button>
          </div>
        </label>

        {/* User Rights Notice */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
            {userRightsNotice[language]}
          </p>
        </div>
    </div>

      <PrivacyPolicyDialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy} />
    </>
  );
};
