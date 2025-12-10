import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Loader2, AlertCircle, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getSavedQuestionnaireIds, removeQuestionnaireId, deleteTelegramMessage } from '@/lib/form-utils';

interface QuestionnaireSummary {
  id: string;
  type: string;
  createdAt: string;
  contactData: {
    telegram?: string;
    instagram?: string;
    phone?: string;
  };
  telegramMessageId?: number;
}

const DataRequest: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireSummary[]>([]);

  const getQuestionnaireTypeName = (type: string) => {
    const names: Record<string, { ru: string; en: string }> = {
      infant: { ru: 'Анкета для младенцев', en: 'Infant Questionnaire' },
      child: { ru: 'Детская анкета', en: 'Child Questionnaire' },
      woman: { ru: 'Женская анкета', en: 'Woman Questionnaire' },
      man: { ru: 'Мужская анкета', en: 'Man Questionnaire' },
    };
    return names[type] || { ru: type, en: type };
  };

  // Load questionnaires on mount
  useEffect(() => {
    const loadQuestionnaires = async () => {
      setLoading(true);
      try {
        const savedIds = getSavedQuestionnaireIds();
        console.log('Loading questionnaires, saved IDs:', savedIds);
        
        if (savedIds.length === 0) {
          setQuestionnaires([]);
          setLoading(false);
          return;
        }

        // Check if we're in development and have local storage items
        const isDevelopment = import.meta.env.DEV;
        let loadedQuestionnaires: QuestionnaireSummary[] = [];

        if (isDevelopment) {
          // In dev, try to load from localStorage for local_ prefixed IDs
          const localIds = savedIds.filter((id: string) => id.startsWith('local_'));
          localIds.forEach((id: string) => {
            try {
              const stored = localStorage.getItem(`questionnaire_${id}`);
              if (stored) {
                const data = JSON.parse(stored);
                loadedQuestionnaires.push({
                  id: data.id,
                  type: data.type,
                  createdAt: data.createdAt,
                  contactData: data.contactData,
                });
              }
            } catch (err) {
              console.error('Error loading questionnaire from localStorage:', err);
            }
          });
        }

        // Try to fetch from API for non-local IDs or in production
        const apiIds = isDevelopment 
          ? savedIds.filter((id: string) => !id.startsWith('local_'))
          : savedIds;

        if (apiIds.length > 0) {
          try {
            const response = await fetch('/api/get-questionnaires-by-ids', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ids: apiIds }),
            });

            if (response && response.ok) {
              const data = await response.json();
              console.log('API response:', data);
              if (data.questionnaires) {
                loadedQuestionnaires.push(...data.questionnaires.map((q: any) => ({
                  id: q.id,
                  type: q.type,
                  createdAt: q.createdAt,
                  contactData: q.contactData,
                  telegramMessageId: q.telegramMessageId,
                })));
              }
            }
          } catch (apiError) {
            console.warn('API not available, using only localStorage data:', apiError);
          }
        }

        console.log('Loaded questionnaires:', loadedQuestionnaires);
        
        // Sort by date
        loadedQuestionnaires.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // Filter out any IDs that no longer exist (cleanup)
        const foundIds = loadedQuestionnaires.map((q: QuestionnaireSummary) => q.id);
        const missingIds = savedIds.filter((id: string) => !foundIds.includes(id));
        
        if (missingIds.length > 0) {
          console.log('Removing missing IDs from localStorage:', missingIds);
          missingIds.forEach((id: string) => removeQuestionnaireId(id));
        }

        setQuestionnaires(loadedQuestionnaires);
      } catch (error: any) {
        console.error('Load error:', error);
        toast.error(error.message || (language === 'ru' ? 'Ошибка загрузки' : 'Load error'));
        setQuestionnaires([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestionnaires();
    
    // Reload when page becomes visible (in case user navigated back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadQuestionnaires();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [language]);

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ru' 
      ? 'Вы уверены, что хотите удалить эту анкету? Это действие нельзя отменить.' 
      : 'Are you sure you want to delete this questionnaire? This action cannot be undone.')) {
      return;
    }

    const isDevelopment = import.meta.env.DEV;
    
    // Handle local storage IDs in development
    if (isDevelopment && id.startsWith('local_')) {
      try {
        localStorage.removeItem(`questionnaire_${id}`);
        removeQuestionnaireId(id);
        toast.success(language === 'ru' ? 'Анкета удалена' : 'Questionnaire deleted');
        setQuestionnaires(prev => prev.filter(q => q.id !== id));
        return;
      } catch (error: any) {
        toast.error(error.message || (language === 'ru' ? 'Ошибка при удалении' : 'Error deleting'));
        return;
      }
    }

    // Try API deletion
    try {
      const response = await fetch(`/api/delete-questionnaire?id=${id}`, {
        method: 'DELETE',
      });

      if (!response || !response.ok) {
        // If API fails but it's a local ID, try localStorage
        if (isDevelopment) {
          try {
            localStorage.removeItem(`questionnaire_${id}`);
            removeQuestionnaireId(id);
            toast.success(language === 'ru' ? 'Анкета удалена' : 'Questionnaire deleted');
            setQuestionnaires(prev => prev.filter(q => q.id !== id));
            return;
          } catch (err) {
            // Continue to error handling
          }
        }
        
        const text = await response?.text() || '';
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = {};
        }
        toast.error(data.error || (language === 'ru' ? 'Ошибка при удалении' : 'Error deleting'));
        return;
      }

      const data = await response.json();

      toast.success(language === 'ru' ? 'Анкета удалена' : 'Questionnaire deleted');
      // Remove from list and localStorage
      setQuestionnaires(prev => prev.filter(q => q.id !== id));
      removeQuestionnaireId(id);
    } catch (error: any) {
      // If fetch fails, try localStorage as fallback
      if (isDevelopment) {
        try {
          localStorage.removeItem(`questionnaire_${id}`);
          removeQuestionnaireId(id);
          toast.success(language === 'ru' ? 'Анкета удалена' : 'Questionnaire deleted');
          setQuestionnaires(prev => prev.filter(q => q.id !== id));
          return;
        } catch (err) {
          // Continue to error handling
        }
      }
      toast.error(error.message || (language === 'ru' ? 'Ошибка при удалении' : 'Error deleting'));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(
      language === 'ru' ? 'ru-RU' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };

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
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === 'ru' ? 'Мои отправленные анкеты' : 'My Submitted Questionnaires'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ru' 
                ? 'Здесь отображаются все отправленные вами анкеты'
                : 'All your submitted questionnaires are displayed here'}
            </p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === 'ru' ? 'Загрузка анкет...' : 'Loading questionnaires...'}
              </p>
            </div>
          )}

          {!loading && questionnaires.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === 'ru' 
                  ? 'У вас пока нет отправленных анкет'
                  : 'You have no submitted questionnaires yet'}
              </p>
            </div>
          )}

          {!loading && questionnaires.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {language === 'ru' 
                  ? `Всего анкет: ${questionnaires.length}`
                  : `Total questionnaires: ${questionnaires.length}`}
              </p>

              <div className="space-y-3">
                {questionnaires.map((q) => {
                  const typeName = getQuestionnaireTypeName(q.type);
                  return (
                    <div
                      key={q.id}
                      className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors bg-card"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1">
                            {typeName[language]}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ru' ? 'Отправлена:' : 'Submitted:'} {formatDate(q.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/questionnaire/${q.id}?lang=${language}`)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            {language === 'ru' ? 'Просмотр' : 'View'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(q.id)}
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            {language === 'ru' ? 'Удалить' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DataRequest;

