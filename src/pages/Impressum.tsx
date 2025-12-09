import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const impressumContent = {
  ru: {
    title: 'Правовая информация',
    backToHome: 'Вернуться на главную',
    impressum: 'Правовая информация',
    accordingTo: 'Информация согласно § 5 TMG',
    nameLabel: 'Имя и фамилия:',
    name: 'Айнур Щербакова',
    addressLabel: 'Адрес:',
    address: 'Россия, Воронежская область, г. Воронеж, ул. Ломоносова 114/25, кВ 184',
    emailLabel: 'Электронная почта:',
    email: 'ajnur_gasanova@mail.ru',
    responsibleLabel: 'Ответственный за содержание согласно § 18 Abs. 2 MStV:',
  },
  en: {
    title: 'Legal Information',
    backToHome: 'Back to home',
    impressum: 'Impressum',
    accordingTo: 'Information according to § 5 TMG',
    nameLabel: 'First and Last Name:',
    name: 'Ainur Sherbakova',
    addressLabel: 'Address:',
    address: 'Russia, Voronezh Region, Voronezh, Lomonosov Street 114/25, Apt. 184',
    emailLabel: 'E-Mail:',
    email: 'ajnur_gasanova@mail.ru',
    responsibleLabel: 'Responsible for content according to § 18 Abs. 2 MStV:',
  },
};

const Impressum: React.FC = () => {
  const { language } = useLanguage();
  const currentLanguage = language || 'ru';
  const content = impressumContent[currentLanguage] || impressumContent.ru;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Home className="w-4 h-4" />
            {content.backToHome}
          </Link>
        </div>

        <div className="card-wellness space-y-6">
          <h1 className="text-3xl font-bold text-foreground">{content.title}</h1>
          
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-4">{content.impressum}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {content.accordingTo}
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">{content.nameLabel}</h3>
              <p>{content.name}</p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">{content.addressLabel}</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{content.address}</p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">{content.emailLabel}</h3>
              <p>
                <a 
                  href={`mailto:${content.email}`}
                  className="text-primary hover:underline"
                >
                  {content.email}
                </a>
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">
                {content.responsibleLabel}
              </h3>
              <p>
                {content.name}<br />
                {content.address}
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Impressum;

