import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Search, Loader2, AlertCircle, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QuestionnaireSummary {
  id: string;
  type: string;
  createdAt: string;
  contactData: {
    telegram?: string;
    instagram?: string;
    phone?: string;
  };
}

const DataRequest: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireSummary[]>([]);
  const [searched, setSearched] = useState(false);

  const getQuestionnaireTypeName = (type: string) => {
    const names: Record<string, { ru: string; en: string }> = {
      infant: { ru: 'Анкета для младенцев', en: 'Infant Questionnaire' },
      child: { ru: 'Детская анкета', en: 'Child Questionnaire' },
      woman: { ru: 'Женская анкета', en: 'Woman Questionnaire' },
      man: { ru: 'Мужская анкета', en: 'Man Questionnaire' },
    };
    return names[type] || { ru: type, en: type };
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!telegram && !instagram && !phone) {
      toast.error(language === 'ru' 
        ? 'Укажите хотя бы один способ связи' 
        : 'Please provide at least one contact method');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Prepare search data - send empty strings as undefined
      const searchData: { telegram?: string; instagram?: string; phone?: string } = {};
      if (telegram.trim()) searchData.telegram = telegram.trim();
      if (instagram.trim()) searchData.instagram = instagram.trim();
      if (phone.trim()) searchData.phone = phone.trim();

      const response = await fetch('/api/search-questionnaires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || (language === 'ru' ? 'Ошибка поиска' : 'Search error'));
        setQuestionnaires([]);
        return;
      }

      setQuestionnaires(data.questionnaires || []);
      
      if (data.count === 0) {
        toast.info(language === 'ru' 
          ? 'Анкеты не найдены' 
          : 'No questionnaires found');
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.message || (language === 'ru' ? 'Ошибка поиска' : 'Search error'));
      setQuestionnaires([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ru' 
      ? 'Вы уверены, что хотите удалить эту анкету? Это действие нельзя отменить.' 
      : 'Are you sure you want to delete this questionnaire? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/delete-questionnaire?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || (language === 'ru' ? 'Ошибка при удалении' : 'Error deleting'));
        return;
      }

      toast.success(language === 'ru' ? 'Анкета удалена' : 'Questionnaire deleted');
      // Remove from list
      setQuestionnaires(prev => prev.filter(q => q.id !== id));
    } catch (error: any) {
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
              {language === 'ru' ? 'Запрос данных' : 'Data Request'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ru' 
                ? 'Введите ваши контактные данные, чтобы найти все отправленные анкеты'
                : 'Enter your contact information to find all submitted questionnaires'}
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Telegram {language === 'ru' ? '(необязательно)' : '(optional)'}
              </label>
              <input
                type="text"
                className="input-field"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@username"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Instagram {language === 'ru' ? '(необязательно)' : '(optional)'}
              </label>
              <input
                type="text"
                className="input-field"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                {language === 'ru' ? 'Телефон' : 'Phone'} {language === 'ru' ? '(необязательно)' : '(optional)'}
              </label>
              <input
                type="tel"
                className="input-field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'ru' ? 'Поиск...' : 'Searching...'}
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  {language === 'ru' ? 'Найти анкеты' : 'Find questionnaires'}
                </>
              )}
            </Button>
          </form>

        </div>

        {/* Results Section - Separate card */}
        {searched && (
          <div className="card-wellness space-y-4 mt-6">
            <h2 className="text-2xl font-bold text-foreground">
              {language === 'ru' ? 'Мои отправленные анкеты' : 'My Submitted Questionnaires'}
            </h2>

            {loading && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'ru' ? 'Поиск анкет...' : 'Searching questionnaires...'}
                </p>
              </div>
            )}

            {!loading && questionnaires.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'ru' 
                    ? 'Анкеты не найдены. Проверьте введенные данные.'
                    : 'No questionnaires found. Please check your contact information.'}
                </p>
              </div>
            )}

            {!loading && questionnaires.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {language === 'ru' 
                    ? `Найдено анкет: ${questionnaires.length}`
                    : `Found ${questionnaires.length} questionnaire${questionnaires.length !== 1 ? 's' : ''}`}
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
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default DataRequest;

