import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            © {new Date().getFullYear()} {language === 'ru' ? 'Анкета по здоровью' : 'Health Questionnaire'}
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/impressum"
              className="hover:text-foreground transition-colors"
            >
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

