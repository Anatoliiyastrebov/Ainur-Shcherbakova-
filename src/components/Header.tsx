import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart } from 'lucide-react';

export const Header: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          to={`/?lang=${language}`} 
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-lg hidden sm:block">
            {t('siteTitle')}
          </span>
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
};
