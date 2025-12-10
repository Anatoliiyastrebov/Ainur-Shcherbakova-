import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Home, Send, ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Success: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const questionnaireId = searchParams.get('id');
  
  const questionnaireUrl = questionnaireId 
    ? `${window.location.origin}/questionnaire/${questionnaireId}?lang=${language}`
    : null;

  const copyLink = () => {
    if (questionnaireUrl) {
      navigator.clipboard.writeText(questionnaireUrl);
      toast.success(language === 'ru' ? 'Ссылка скопирована!' : 'Link copied!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="card-wellness text-center max-w-md animate-slide-up">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t('thankYou')}
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            {t('successMessage')}
          </p>

          {questionnaireUrl && (
            <div className="bg-accent/50 rounded-xl p-4 mb-8 space-y-3">
              <p className="text-sm font-medium text-foreground">
                {language === 'ru' 
                  ? 'Вы можете просмотреть и удалить свою анкету по этой ссылке:'
                  : 'You can view and delete your questionnaire using this link:'}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={questionnaireUrl}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyLink}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {language === 'ru' ? 'Копировать' : 'Copy'}
                </Button>
              </div>
              <Link
                to={`/questionnaire/${questionnaireId}?lang=${language}`}
                className="btn-secondary inline-flex items-center gap-2 w-full justify-center"
              >
                <ExternalLink className="w-4 h-4" />
                {language === 'ru' ? 'Открыть анкету' : 'Open questionnaire'}
              </Link>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/?lang=${language}`}
              className="btn-secondary flex items-center justify-center gap-2 flex-1"
            >
              <Home className="w-5 h-5" />
              {t('backToHome')}
            </Link>

            <Link
              to={`/?lang=${language}`}
              className="btn-primary flex items-center justify-center gap-2 flex-1"
            >
              <Send className="w-5 h-5" />
              {t('sendAnother')}
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="fixed top-1/3 left-1/4 w-32 h-32 bg-success/10 rounded-full blur-3xl pointer-events-none animate-pulse-soft" />
        <div className="fixed bottom-1/3 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Success;
