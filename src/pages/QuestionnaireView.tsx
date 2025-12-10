import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QuestionnaireData {
  id: string;
  type: string;
  formData: any;
  additionalData: any;
  contactData: any;
  markdown: string;
  createdAt: string;
  language: string;
}

const QuestionnaireView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestionnaire = async () => {
      if (!id) {
        setError('Questionnaire ID is required');
        setLoading(false);
        return;
      }

      try {
        // Check if it's a local storage ID (development)
        const isDevelopment = import.meta.env.DEV;
        if (isDevelopment && id.startsWith('local_')) {
          try {
            const stored = localStorage.getItem(`questionnaire_${id}`);
            if (stored) {
              const data = JSON.parse(stored);
              setQuestionnaire(data);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error('Error loading from localStorage:', err);
          }
        }

        // Try API
        const response = await fetch(`/api/get-questionnaire?id=${id}`);
        
        if (!response || !response.ok) {
          setError('Failed to load questionnaire');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setQuestionnaire(data.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load questionnaire');
      } finally {
        setLoading(false);
      }
    };

    loadQuestionnaire();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirm(language === 'ru' 
      ? 'Вы уверены, что хотите удалить эту анкету? Это действие нельзя отменить.' 
      : 'Are you sure you want to delete this questionnaire? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/delete-questionnaire?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || (language === 'ru' ? 'Ошибка при удалении' : 'Error deleting'));
        setDeleting(false);
        return;
      }

      toast.success(language === 'ru' ? 'Анкета удалена' : 'Questionnaire deleted');
      navigate(`/?lang=${language}`);
    } catch (err: any) {
      toast.error(err.message || (language === 'ru' ? 'Ошибка при удалении' : 'Error deleting'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              {language === 'ru' ? 'Загрузка анкеты...' : 'Loading questionnaire...'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !questionnaire) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="card-wellness text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {language === 'ru' ? 'Ошибка' : 'Error'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || (language === 'ru' ? 'Анкета не найдена' : 'Questionnaire not found')}
            </p>
            <Link
              to={`/?lang=${language}`}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              {language === 'ru' ? 'На главную' : 'Home'}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(questionnaire.createdAt).toLocaleString(
    language === 'ru' ? 'ru-RU' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link
            to={`/?lang=${language}`}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Home className="w-4 h-4" />
            {language === 'ru' ? 'На главную' : 'Back to home'}
          </Link>
        </div>

        <div className="card-wellness space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {language === 'ru' ? 'Ваша анкета' : 'Your Questionnaire'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === 'ru' ? 'Отправлена:' : 'Submitted:'} {formattedDate}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === 'ru' ? 'Удаление...' : 'Deleting...'}
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  {language === 'ru' ? 'Удалить' : 'Delete'}
                </>
              )}
            </Button>
          </div>

          <div className="border-t pt-6">
            <div 
              className="space-y-4 text-foreground"
              style={{ whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ 
                __html: questionnaire.markdown
                  .replace(/<b>/g, '<strong class="font-bold">')
                  .replace(/<\/b>/g, '</strong>')
                  .replace(/<i>/g, '<em class="italic">')
                  .replace(/<\/i>/g, '</em>')
                  .replace(/<a href="([^"]+)">([^<]+)<\/a>/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline break-all">$2</a>')
                  .replace(/\n/g, '<br>')
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuestionnaireView;

