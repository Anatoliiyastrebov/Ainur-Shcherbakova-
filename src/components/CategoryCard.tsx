import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Baby, User, Heart, UserCircle } from 'lucide-react';
import { QuestionnaireType } from '@/lib/questionnaire-data';

interface CategoryCardProps {
  type: QuestionnaireType;
  title: string;
  description: string;
}

const icons: Record<QuestionnaireType, React.ReactNode> = {
  infant: <Baby className="w-8 h-8" />,
  child: <User className="w-8 h-8" />,
  woman: <Heart className="w-8 h-8" />,
  man: <UserCircle className="w-8 h-8" />,
};

const colors: Record<QuestionnaireType, string> = {
  infant: 'bg-pink-50 text-pink-600',
  child: 'bg-blue-50 text-blue-600',
  woman: 'bg-rose-50 text-rose-600',
  man: 'bg-cyan-50 text-cyan-600',
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ type, title, description }) => {
  const { language } = useLanguage();

  return (
    <Link
      to={`/anketa?type=${type}&lang=${language}`}
      className="category-card group flex flex-col items-center text-center p-8"
    >
      <div className={`w-16 h-16 rounded-2xl ${colors[type]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icons[type]}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
};
