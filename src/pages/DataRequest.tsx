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

        // Always try to load from localStorage first (works in both dev and production)
        let loadedQuestionnaires: QuestionnaireSummary[] = [];
        
        // Load from localStorage for all IDs
        savedIds.forEach((id: string) => {
          try {
            const stored = localStorage.getItem(`questionnaire_${id}`);
            if (stored) {
              const data = JSON.parse(stored);
              loadedQuestionnaires.push({
                id: data.id,
                type: data.type,
                createdAt: data.createdAt,
                contactData: data.contactData,
                telegramMessageId: data.telegramMessageId,
              });
            }
          } catch (err) {
            console.error('Error loading questionnaire from localStorage:', err);
          }
        });

        // Also try to fetch from API for any IDs not found in localStorage
        // This helps if localStorage was cleared but API still has data
        const foundLocalIds = loadedQuestionnaires.map(q => q.id);
        const apiIds = savedIds.filter((id: string) => !foundLocalIds.includes(id));

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
                // Add questionnaires from API and also save them to localStorage
                data.questionnaires.forEach((q: any) => {
                  // Only add if not already loaded from localStorage
                  if (!loadedQuestionnaires.find(existing => existing.id === q.id)) {
                    loadedQuestionnaires.push({
                      id: q.id,
                      type: q.type,
                      createdAt: q.createdAt,
                      contactData: q.contactData,
                      telegramMessageId: q.telegramMessageId,
                    });
                    
                    // Try to fetch full data from API and save to localStorage
                    // This is a backup to ensure we have the full data
                    fetch(`/api/get-questionnaire?id=${q.id}`)
                      .then(res => res.json())
                      .then(result => {
                        if (result.success && result.data) {
                          try {
                            localStorage.setItem(`questionnaire_${q.id}`, JSON.stringify(result.data));
                          } catch (err) {
                            console.error('Error saving questionnaire to localStorage:', err);
                          }
                        }
                      })
                      .catch(err => console.warn('Error fetching full questionnaire data:', err));
                  }
                });
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

    // Find questionnaire to get message_id before deletion
    let questionnaire = questionnaires.find(q => q.id === id);
    
    // If messageId not found in summary, try to load full questionnaire from localStorage
    if (!questionnaire?.telegramMessageId) {
      try {
        const stored = localStorage.getItem(`questionnaire_${id}`);
        if (stored) {
          const data = JSON.parse(stored);
          questionnaire = {
            id: data.id,
            type: data.type,
            createdAt: data.createdAt,
            contactData: data.contactData,
            telegramMessageId: data.telegramMessageId,
          };
          console.log('Loaded questionnaire from localStorage for deletion:', questionnaire);
        }
      } catch (err) {
        console.error('Error loading questionnaire from localStorage:', err);
      }
    }
    
    const messageId = questionnaire?.telegramMessageId;
    console.log('Attempting to delete questionnaire:', { id, messageId, hasQuestionnaire: !!questionnaire });
    
    // Delete from Telegram first if message_id exists
    if (messageId) {
      console.log('Deleting Telegram message:', messageId);
      try {
        const deleteResult = await deleteTelegramMessage(messageId);
        if (!deleteResult.success) {
          console.warn('Failed to delete Telegram message:', deleteResult.error);
          // Continue with questionnaire deletion even if Telegram delete fails
          toast.warning(
            language === 'ru' 
              ? 'Анкета удалена, но сообщение в Telegram может остаться: ' + (deleteResult.error || 'Неизвестная ошибка')
              : 'Questionnaire deleted, but Telegram message may remain: ' + (deleteResult.error || 'Unknown error'),
            { duration: 5000 }
          );
        } else {
          console.log('Successfully deleted Telegram message:', messageId);
          toast.success(language === 'ru' ? 'Сообщение в Telegram удалено' : 'Telegram message deleted', { duration: 2000 });
        }
      } catch (error: any) {
        console.error('Error deleting Telegram message:', error);
        toast.warning(
          language === 'ru' 
            ? 'Ошибка при удалении из Telegram: ' + (error.message || 'Неизвестная ошибка')
            : 'Error deleting from Telegram: ' + (error.message || 'Unknown error'),
          { duration: 5000 }
        );
        // Continue with questionnaire deletion
      }
    } else {
      console.warn('No telegramMessageId found for questionnaire:', id);
    }

    // Delete from localStorage only AFTER Telegram deletion (to preserve data if Telegram delete fails)
    // Don't delete from localStorage yet - keep it as backup
    
    // If it's a local_ ID, delete from localStorage and we're done (development mode)
    if (id.startsWith('local_')) {
      try {
        localStorage.removeItem(`questionnaire_${id}`);
        removeQuestionnaireId(id);
      } catch (err) {
        console.warn('Error removing from localStorage:', err);
      }
      toast.success(language === 'ru' ? 'Анкета удалена' : 'Questionnaire deleted');
      setQuestionnaires(prev => prev.filter(q => q.id !== id));
      return;
    }

    // Try API deletion (which will also try to delete from Telegram as backup)
    try {
      const response = await fetch(`/api/delete-questionnaire?id=${id}`, {
        method: 'DELETE',
      });

      // Now delete from localStorage after API call
      try {
        localStorage.removeItem(`questionnaire_${id}`);
        removeQuestionnaireId(id);
      } catch (err) {
        console.warn('Error removing from localStorage:', err);
      }

      if (!response || !response.ok) {
        const text = await response?.text() || '';
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = {};
        }
        
        // Telegram deletion already handled above, localStorage deleted here
        toast.success(language === 'ru' ? 'Анкета удалена' : 'Questionnaire deleted');
        setQuestionnaires(prev => prev.filter(q => q.id !== id));
        console.warn('API deletion failed, but removed from localStorage and Telegram:', data.error || 'Unknown error');
        return;
      }

      const data = await response.json();

      toast.success(language === 'ru' ? 'Анкета удалена' : 'Questionnaire deleted');
      // Remove from list (localStorage and Telegram already handled above)
      setQuestionnaires(prev => prev.filter(q => q.id !== id));
    } catch (error: any) {
      // Delete from localStorage even if API fails
      try {
        localStorage.removeItem(`questionnaire_${id}`);
        removeQuestionnaireId(id);
      } catch (err) {
        console.warn('Error removing from localStorage:', err);
      }
      // Telegram deletion already handled above
      toast.success(language === 'ru' ? 'Анкета удалена' : 'Questionnaire deleted');
      setQuestionnaires(prev => prev.filter(q => q.id !== id));
      console.warn('API deletion error, but removed from localStorage and Telegram:', error.message);
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

