import { Language } from './translations';

export type QuestionType = 'text' | 'number' | 'radio' | 'checkbox' | 'textarea';

export interface QuestionOption {
  value: string;
  label: {
    ru: string;
    en: string;
  };
}

export interface Question {
  id: string;
  type: QuestionType;
  label: {
    ru: string;
    en: string;
  };
  icon: string;
  options?: QuestionOption[];
  required: boolean;
  hasAdditional: boolean;
  placeholder?: {
    ru: string;
    en: string;
  };
}

export interface QuestionnaireSection {
  id: string;
  title: {
    ru: string;
    en: string;
  };
  icon: string;
  questions: Question[];
}

// Common options used across questionnaires
const yesNoOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'yes', label: { ru: 'Да', en: 'Yes' } },
  { value: 'no', label: { ru: 'Нет', en: 'No' } },
];

const yesNoOptionsSimple: QuestionOption[] = [
  { value: 'yes', label: { ru: 'Да', en: 'Yes' } },
  { value: 'no', label: { ru: 'Нет', en: 'No' } },
];

const digestionOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'stomach_pain', label: { ru: 'Боли в животе', en: 'Stomach pain' } },
  { value: 'diarrhea', label: { ru: 'Диарея', en: 'Diarrhea' } },
  { value: 'constipation', label: { ru: 'Запор', en: 'Constipation' } },
];

const digestionOptionsExtended: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'stomach_pain', label: { ru: 'Боли в животе', en: 'Stomach pain' } },
  { value: 'diarrhea', label: { ru: 'Диарея', en: 'Diarrhea' } },
  { value: 'constipation', label: { ru: 'Запор', en: 'Constipation' } },
  { value: 'bloating', label: { ru: 'Вздутие', en: 'Bloating' } },
];

const digestionOptionsAdult: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'heartburn', label: { ru: 'Изжога', en: 'Heartburn' } },
  { value: 'bloating', label: { ru: 'Вздутие', en: 'Bloating' } },
  { value: 'diarrhea', label: { ru: 'Диарея', en: 'Diarrhea' } },
  { value: 'constipation', label: { ru: 'Запор', en: 'Constipation' } },
];

const allergyOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'pollen', label: { ru: 'Цветение', en: 'Pollen' } },
  { value: 'animals', label: { ru: 'Животные', en: 'Animals' } },
  { value: 'dust', label: { ru: 'Пыль', en: 'Dust' } },
  { value: 'food', label: { ru: 'Еда', en: 'Food' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other' } },
];

const allergyOptionsExtended: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'pollen', label: { ru: 'Цветение', en: 'Pollen' } },
  { value: 'animals', label: { ru: 'Животные', en: 'Animals' } },
  { value: 'dust', label: { ru: 'Пыль', en: 'Dust' } },
  { value: 'food', label: { ru: 'Еда', en: 'Food' } },
  { value: 'medications', label: { ru: 'Лекарства', en: 'Medications' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other' } },
];

const skinOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'moles', label: { ru: 'Много родинок', en: 'Many moles' } },
  { value: 'warts', label: { ru: 'Бородавки', en: 'Warts' } },
  { value: 'rashes', label: { ru: 'Высыпания', en: 'Rashes' } },
  { value: 'eczema', label: { ru: 'Экзема', en: 'Eczema' } },
];

const sleepOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'good', label: { ru: 'Хорошо', en: 'Good' } },
  { value: 'bad', label: { ru: 'Плохо', en: 'Bad' } },
  { value: 'sometimes', label: { ru: 'Иногда проблемы', en: 'Sometimes problems' } },
];

const sleepOptionsSimple: QuestionOption[] = [
  { value: 'good', label: { ru: 'Хорошо', en: 'Good' } },
  { value: 'bad', label: { ru: 'Плохо', en: 'Bad' } },
  { value: 'sometimes', label: { ru: 'Иногда проблемы', en: 'Sometimes problems' } },
];

const energyOptions: QuestionOption[] = [
  { value: 'normal', label: { ru: 'Нормальная', en: 'Normal' } },
  { value: 'reduced', label: { ru: 'Сниженная', en: 'Reduced' } },
  { value: 'very_low', label: { ru: 'Очень низкая', en: 'Very low' } },
];

const birthOptions: QuestionOption[] = [
  { value: 'natural', label: { ru: 'Естественно', en: 'Natural' } },
  { value: 'cesarean', label: { ru: 'Кесарево', en: 'Cesarean' } },
];

const injuriesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Все в порядке', en: 'All is well' } },
  { value: 'injuries', label: { ru: 'Травмы', en: 'Injuries' } },
  { value: 'surgeries', label: { ru: 'Операции', en: 'Surgeries' } },
  { value: 'head_trauma', label: { ru: 'Удары по голове', en: 'Head trauma' } },
  { value: 'fractures', label: { ru: 'Переломы', en: 'Fractures' } },
  { value: 'severe_falls', label: { ru: 'Сильные падения', en: 'Severe falls' } },
];

const covidOptionsWoman: QuestionOption[] = [
  { value: 'no', label: { ru: 'Нет', en: 'No' } },
  { value: 'had_covid', label: { ru: 'Болела', en: 'Had COVID' } },
  { value: 'vaccinated', label: { ru: 'Вакцинирована', en: 'Vaccinated' } },
  { value: 'both', label: { ru: 'И болела, и вакцинирована', en: 'Both had COVID and vaccinated' } },
];

const covidOptionsMan: QuestionOption[] = [
  { value: 'no', label: { ru: 'Нет', en: 'No' } },
  { value: 'had_covid', label: { ru: 'Болел', en: 'Had COVID' } },
  { value: 'vaccinated', label: { ru: 'Вакцинирован', en: 'Vaccinated' } },
  { value: 'both', label: { ru: 'И болел, и вакцинирован', en: 'Both had COVID and vaccinated' } },
];

const teethOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'crumble', label: { ru: 'Крошатся', en: 'Crumble' } },
  { value: 'decay_fast', label: { ru: 'Часто портятся', en: 'Decay often' } },
  { value: 'bad_breath', label: { ru: 'Запах изо рта', en: 'Bad breath' } },
  { value: 'bleeding_gums', label: { ru: 'Кровоточивость', en: 'Bleeding gums' } },
];

const jointOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'crunch', label: { ru: 'Хруст', en: 'Crunching' } },
  { value: 'squeak', label: { ru: 'Скрип', en: 'Squeaking' } },
  { value: 'inflammation', label: { ru: 'Воспаление', en: 'Inflammation' } },
];

const hairOptions: QuestionOption[] = [
  { value: 'falling', label: { ru: 'Выпадают', en: 'Falling out' } },
  { value: 'split', label: { ru: 'Секутся', en: 'Split ends' } },
  { value: 'dry', label: { ru: 'Сухие', en: 'Dry' } },
  { value: 'ok', label: { ru: 'В порядке', en: 'Normal' } },
];

const skinConditionOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'dry', label: { ru: 'Сухая', en: 'Dry' } },
  { value: 'rashes', label: { ru: 'Высыпания', en: 'Rashes' } },
  { value: 'irritation', label: { ru: 'Раздражение', en: 'Irritation' } },
  { value: 'acne', label: { ru: 'Прыщи', en: 'Acne' } },
  { value: 'other', label: { ru: 'Другое', en: 'Other' } },
];

const molesWartsHerpesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'moles', label: { ru: 'Родинки', en: 'Moles' } },
  { value: 'warts', label: { ru: 'Бородавки', en: 'Warts' } },
  { value: 'herpes', label: { ru: 'Герпес', en: 'Herpes' } },
];

const dischargeMolesWartsHerpesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'thrush', label: { ru: 'Молочница', en: 'Thrush' } },
  { value: 'moles', label: { ru: 'Много родинок', en: 'Many moles' } },
  { value: 'warts', label: { ru: 'Бородавки', en: 'Warts' } },
  { value: 'hpv_skin', label: { ru: 'Папилломавирус на коже', en: 'HPV on skin' } },
  { value: 'herpes', label: { ru: 'Герпес', en: 'Herpes' } },
];

const memoryOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'poor_memory', label: { ru: 'Плохая память', en: 'Poor memory' } },
  { value: 'poor_concentration', label: { ru: 'Плохая концентрация', en: 'Poor concentration' } },
  { value: 'both', label: { ru: 'И память, и концентрация', en: 'Both memory and concentration' } },
];

const illnessAntibioticsOptions: QuestionOption[] = [
  { value: 'rarely_ill', label: { ru: 'Редко болеет', en: 'Rarely ill' } },
  { value: 'often_ill', label: { ru: 'Часто болеет', en: 'Often ill' } },
  { value: 'took_antibiotics', label: { ru: 'Принимал антибиотики', en: 'Took antibiotics' } },
  { value: 'both', label: { ru: 'И часто болеет, и принимал антибиотики', en: 'Both often ill and took antibiotics' } },
];

const cystsStonesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'cysts', label: { ru: 'Кисты', en: 'Cysts' } },
  { value: 'fibroids', label: { ru: 'Миомы', en: 'Fibroids' } },
  { value: 'stones_kidneys', label: { ru: 'Камни в почках', en: 'Stones in kidneys' } },
  { value: 'sand_kidneys', label: { ru: 'Песок в почках', en: 'Sand in kidneys' } },
  { value: 'stones_gallbladder', label: { ru: 'Камни в желчном', en: 'Stones in gallbladder' } },
];

const cystsStonesKidneysOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'cysts', label: { ru: 'Кисты', en: 'Cysts' } },
  { value: 'sand', label: { ru: 'Песок', en: 'Sand' } },
  { value: 'stones_kidneys', label: { ru: 'Камни в почках', en: 'Stones in kidneys' } },
  { value: 'stones_gallbladder', label: { ru: 'Камни в желчном', en: 'Stones in gallbladder' } },
];

const menstruationOptions: QuestionOption[] = [
  { value: 'regular', label: { ru: 'Регулярные', en: 'Regular' } },
  { value: 'heavy', label: { ru: 'Обильные', en: 'Heavy' } },
  { value: 'clots', label: { ru: 'Сгустками', en: 'With clots' } },
  { value: 'painful', label: { ru: 'Болезненные', en: 'Painful' } },
  { value: 'hot_flashes', label: { ru: 'Приливы', en: 'Hot flashes' } },
  { value: 'sweating', label: { ru: 'Потливость', en: 'Sweating' } },
  { value: 'poor_sleep', label: { ru: 'Плохой сон', en: 'Poor sleep' } },
  { value: 'mood_swings', label: { ru: 'Скачки настроения', en: 'Mood swings' } },
];

const headachesOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'headaches', label: { ru: 'Головные боли', en: 'Headaches' } },
  { value: 'migraines', label: { ru: 'Мигрени', en: 'Migraines' } },
  { value: 'injuries', label: { ru: 'Травмы', en: 'Injuries' } },
  { value: 'concussion', label: { ru: 'Сотрясение', en: 'Concussion' } },
];

const headachesSleepOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'headaches', label: { ru: 'Головные боли', en: 'Headaches' } },
  { value: 'poor_sleep', label: { ru: 'Плохой сон', en: 'Poor sleep' } },
  { value: 'both', label: { ru: 'И головные боли, и плохой сон', en: 'Both headaches and poor sleep' } },
];

const hyperactiveOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'hyperactive', label: { ru: 'Гиперактивный', en: 'Hyperactive' } },
  { value: 'tired_often', label: { ru: 'Часто устаёт', en: 'Often tired' } },
  { value: 'normal', label: { ru: 'Нормально', en: 'Normal' } },
];

const sugarOptions: QuestionOption[] = [
  { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
  { value: 'no', label: { ru: 'Нет', en: 'No' } },
  { value: 'moderate', label: { ru: 'Умеренно', en: 'Moderate' } },
  { value: 'strong', label: { ru: 'Сильно', en: 'Strong' } },
];

const pressureOptions: QuestionOption[] = [
  { value: 'low', label: { ru: 'Низкое', en: 'Low' } },
  { value: 'high', label: { ru: 'Высокое', en: 'High' } },
  { value: 'normal', label: { ru: 'Нормальное', en: 'Normal' } },
];

const waterOptions: QuestionOption[] = [
  { value: '1', label: { ru: '1 литр', en: '1 liter' } },
  { value: '1.5', label: { ru: '1.5 литра', en: '1.5 liters' } },
  { value: '2', label: { ru: '2 литра', en: '2 liters' } },
  { value: '2.5', label: { ru: '2.5 литра', en: '2.5 liters' } },
  { value: '3', label: { ru: '3 литра', en: '3 liters' } },
  { value: '3.5', label: { ru: '3.5 литра', en: '3.5 liters' } },
];

const sleepAdultOptions: QuestionOption[] = [
  { value: 'good', label: { ru: 'Хороший', en: 'Good' } },
  { value: 'hard_to_fall_asleep', label: { ru: 'Трудно заснуть', en: 'Hard to fall asleep' } },
  { value: 'wake_often', label: { ru: 'Часто просыпаюсь', en: 'Wake up often' } },
];

const weightSatisfactionOptions: QuestionOption[] = [
  { value: 'no', label: { ru: 'Нет', en: 'No' } },
  { value: 'yes_lose', label: { ru: 'Да, хотелось бы похудеть', en: 'Yes, would like to lose weight' } },
  { value: 'yes_gain', label: { ru: 'Да, хотелось бы набрать', en: 'Yes, would like to gain weight' } },
];

// Infant questionnaire (type = infant)
export const infantQuestionnaire: QuestionnaireSection[] = [
  {
    id: 'personal',
    title: { ru: 'Личные данные', en: 'Personal Information' },
    icon: 'user',
    questions: [
      {
        id: 'name',
        type: 'text',
        label: { ru: 'Имя', en: 'Name' },
        icon: 'user',
        required: true,
        hasAdditional: false,
      },
      {
        id: 'age_months',
        type: 'number',
        label: { ru: 'Возраст (в месяцах)', en: 'Age (in months)' },
        icon: 'calendar',
        required: true,
        hasAdditional: false,
      },
      {
        id: 'weight',
        type: 'number',
        label: { ru: 'Вес (кг)', en: 'Weight (kg)' },
        icon: 'scale',
        required: true,
        hasAdditional: false,
      },
    ],
  },
  {
    id: 'health',
    title: { ru: 'Здоровье', en: 'Health' },
    icon: 'heart',
    questions: [
      {
        id: 'digestion',
        type: 'checkbox',
        label: { ru: 'Пищеварение', en: 'Digestion' },
        icon: 'heart',
        options: digestionOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'sweats_at_night',
        type: 'radio',
        label: { ru: 'Потеет во сне', en: 'Sweats at night' },
        icon: 'droplets',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'bad_breath',
        type: 'radio',
        label: { ru: 'Есть ли неприятный запах изо рта', en: 'Is there bad breath' },
        icon: 'wind',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'skin_condition',
        type: 'checkbox',
        label: { ru: 'Родинки / бородавки / высыпания / экзема', en: 'Moles / warts / rashes / eczema' },
        icon: 'sparkles',
        options: skinOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'allergies',
        type: 'checkbox',
        label: { ru: 'Аллергия', en: 'Allergies' },
        icon: 'flower',
        options: allergyOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'water_per_day',
        type: 'number',
        label: { ru: 'Сколько воды в день пьёт ребенок (литров)', en: 'How much water does the child drink per day (liters)' },
        icon: 'droplet',
        required: true,
        hasAdditional: true,
      },
      {
        id: 'injuries',
        type: 'checkbox',
        label: { ru: 'Травмы / операции / удары по голове / переломы', en: 'Injuries / surgeries / head trauma / fractures' },
        icon: 'activity',
        options: injuriesOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'sleep_quality',
        type: 'radio',
        label: { ru: 'Хорошо ли спит', en: 'Does the child sleep well' },
        icon: 'moon',
        options: sleepOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'illness_antibiotics',
        type: 'checkbox',
        label: { ru: 'Часто ли болеет / принимал ли антибиотики', en: 'Is often ill / has taken antibiotics' },
        icon: 'pill',
        options: illnessAntibioticsOptions,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  {
    id: 'birth_pregnancy',
    title: { ru: 'Роды и беременность', en: 'Birth and Pregnancy' },
    icon: 'baby',
    questions: [
      {
        id: 'birth_type',
        type: 'radio',
        label: { ru: 'Как прошли роды', en: 'How was the birth' },
        icon: 'baby',
        options: birthOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'mother_toxicosis',
        type: 'radio',
        label: { ru: 'Был ли у мамы сильный токсикоз при беременности', en: 'Did mother have severe toxicosis during pregnancy' },
        icon: 'alert-circle',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'mother_allergy',
        type: 'radio',
        label: { ru: 'Была ли у мамы аллергия до или во время беременности', en: 'Did mother have allergies before or during pregnancy' },
        icon: 'flower',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'mother_constipation',
        type: 'radio',
        label: { ru: 'Был ли у мамы запор', en: 'Did mother have constipation' },
        icon: 'alert-triangle',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'mother_antibiotics',
        type: 'radio',
        label: { ru: 'Пила ли мама антибиотики во время беременности', en: 'Did mother take antibiotics during pregnancy' },
        icon: 'pill',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'mother_anemia',
        type: 'radio',
        label: { ru: 'Была ли анемия у мамы', en: 'Did mother have anemia' },
        icon: 'heart',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'pregnancy_problems',
        type: 'radio',
        label: { ru: 'Были ли проблемы во время беременности', en: 'Were there problems during pregnancy' },
        icon: 'file-text',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'what_else',
        type: 'textarea',
        label: { ru: 'Что ещё нужно знать о здоровье ребёнка', en: 'What else should we know about the child\'s health' },
        icon: 'info',
        required: false,
        hasAdditional: false,
        placeholder: { ru: 'Дополнительная информация', en: 'Additional information' },
      },
      {
        id: 'how_learned',
        type: 'radio',
        label: { ru: 'Как вы обо мне узнали?', en: 'How did you learn about me?' },
        icon: 'info',
        required: false,
        hasAdditional: true,
        options: [
          { value: 'instagram', label: { ru: 'Инстаграм', en: 'Instagram' } },
          { value: 'telegram_channel', label: { ru: 'Телеграмм канал', en: 'Telegram channel' } },
          { value: 'recommendation', label: { ru: 'По рекомендации', en: 'By recommendation' } },
        ],
      },
    ],
  },
];

// Child questionnaire (type = child)
export const childQuestionnaire: QuestionnaireSection[] = [
  {
    id: 'personal',
    title: { ru: 'Личные данные', en: 'Personal Information' },
    icon: 'user',
    questions: [
      {
        id: 'name',
        type: 'text',
        label: { ru: 'Имя', en: 'Name' },
        icon: 'user',
        required: true,
        hasAdditional: false,
      },
      {
        id: 'age',
        type: 'number',
        label: { ru: 'Возраст', en: 'Age' },
        icon: 'calendar',
        required: true,
        hasAdditional: false,
      },
      {
        id: 'weight',
        type: 'number',
        label: { ru: 'Вес (кг)', en: 'Weight (kg)' },
        icon: 'scale',
        required: true,
        hasAdditional: false,
      },
    ],
  },
  {
    id: 'health',
    title: { ru: 'Здоровье', en: 'Health' },
    icon: 'heart',
    questions: [
      {
        id: 'digestion',
        type: 'checkbox',
        label: { ru: 'Пищеварение', en: 'Digestion' },
        icon: 'heart',
        options: digestionOptionsExtended,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'teeth_decay',
        type: 'radio',
        label: { ru: 'Зубы быстро портятся', en: 'Teeth decay quickly' },
        icon: 'smile',
        options: yesNoOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'sweats_grinds',
        type: 'checkbox',
        label: { ru: 'Потеет во сне / скрипит зубами', en: 'Sweats at night / grinds teeth' },
        icon: 'moon',
        options: [
          { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
          { value: 'sweats', label: { ru: 'Потеет во сне', en: 'Sweats at night' } },
          { value: 'grinds', label: { ru: 'Скрипит зубами', en: 'Grinds teeth' } },
        ],
        required: true,
        hasAdditional: true,
      },
      {
        id: 'bad_breath',
        type: 'radio',
        label: { ru: 'Неприятный запах изо рта', en: 'Bad breath' },
        icon: 'wind',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'sugar_dependency',
        type: 'text',
        label: { ru: 'Зависимость от сладкого', en: 'Sugar dependency' },
        icon: 'candy',
        required: true,
        hasAdditional: true,
        placeholder: { ru: 'Опишите', en: 'Describe' },
      },
      {
        id: 'skin_condition',
        type: 'checkbox',
        label: { ru: 'Родинки / бородавки / высыпания / экзема', en: 'Moles / warts / rashes / eczema' },
        icon: 'sparkles',
        options: skinOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'allergies',
        type: 'checkbox',
        label: { ru: 'Аллергия', en: 'Allergies' },
        icon: 'flower',
        options: allergyOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'hyperactive',
        type: 'radio',
        label: { ru: 'Гиперактивный или часто жалуется на усталость', en: 'Hyperactive or often complains of tiredness' },
        icon: 'zap',
        options: hyperactiveOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'water_per_day',
        type: 'radio',
        label: { ru: 'Сколько воды в день (литров)', en: 'Water per day (liters)' },
        icon: 'droplet',
        options: waterOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'injuries',
        type: 'checkbox',
        label: { ru: 'Травмы / операции / удары по голове / переломы', en: 'Injuries / surgeries / head trauma / fractures' },
        icon: 'activity',
        options: injuriesOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'headaches_sleep',
        type: 'checkbox',
        label: { ru: 'Жалобы на головную боль, плохой сон', en: 'Headache complaints, poor sleep' },
        icon: 'brain',
        options: headachesSleepOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'illness_antibiotics',
        type: 'checkbox',
        label: { ru: 'Часто ли болеет, принимал ли антибиотики', en: 'Is often ill, has taken antibiotics' },
        icon: 'pill',
        options: illnessAntibioticsOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'what_else',
        type: 'textarea',
        label: { ru: 'Что ещё нужно знать', en: 'What else should we know' },
        icon: 'info',
        required: false,
        hasAdditional: false,
        placeholder: { ru: 'Дополнительная информация', en: 'Additional information' },
      },
      {
        id: 'how_learned',
        type: 'radio',
        label: { ru: 'Как вы обо мне узнали?', en: 'How did you learn about me?' },
        icon: 'info',
        required: false,
        hasAdditional: true,
        options: [
          { value: 'instagram', label: { ru: 'Инстаграм', en: 'Instagram' } },
          { value: 'telegram_channel', label: { ru: 'Телеграмм канал', en: 'Telegram channel' } },
          { value: 'recommendation', label: { ru: 'По рекомендации', en: 'By recommendation' } },
        ],
      },
    ],
  },
];

// Woman questionnaire (type = woman)
export const womanQuestionnaire: QuestionnaireSection[] = [
  {
    id: 'personal',
    title: { ru: 'Личные данные', en: 'Personal Information' },
    icon: 'user',
    questions: [
      {
        id: 'name',
        type: 'text',
        label: { ru: 'Имя', en: 'Name' },
        icon: 'user',
        required: true,
        hasAdditional: false,
      },
      {
        id: 'last_name',
        type: 'text',
        label: { ru: 'Фамилия', en: 'Last Name' },
        icon: 'user',
        required: true,
        hasAdditional: false,
      },
      {
        id: 'age',
        type: 'number',
        label: { ru: 'Возраст', en: 'Age' },
        icon: 'calendar',
        required: true,
        hasAdditional: false,
      },
      {
        id: 'weight',
        type: 'number',
        label: { ru: 'Вес (кг)', en: 'Weight (kg)' },
        icon: 'scale',
        required: true,
        hasAdditional: false,
      },
    ],
  },
  {
    id: 'covid',
    title: { ru: 'COVID-19', en: 'COVID-19' },
    icon: 'shield',
    questions: [
      {
        id: 'covid_status',
        type: 'radio',
        label: { ru: 'Был ли ковид или вакцина', en: 'COVID or vaccination status' },
        icon: 'shield',
        options: covidOptionsWoman,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  {
    id: 'health',
    title: { ru: 'Здоровье', en: 'Health' },
    icon: 'heart',
    questions: [
      {
        id: 'weight_satisfaction',
        type: 'radio',
        label: { ru: 'Устраивает ли вас ваш вес?', en: 'Are you satisfied with your weight?' },
        icon: 'scale',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'weight_change_desire',
        type: 'radio',
        label: { ru: 'Хотели бы вы изменить вес?', en: 'Would you like to change your weight?' },
        icon: 'scale',
        options: weightSatisfactionOptions,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'digestion',
        type: 'checkbox',
        label: { ru: 'Пищеварение', en: 'Digestion' },
        icon: 'heart',
        options: digestionOptionsAdult,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'hair_condition',
        type: 'checkbox',
        label: { ru: 'Состояние волос', en: 'Hair condition' },
        icon: 'sparkles',
        options: hairOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'teeth',
        type: 'checkbox',
        label: { ru: 'Зубы', en: 'Teeth' },
        icon: 'smile',
        options: teethOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'joints',
        type: 'checkbox',
        label: { ru: 'Суставы', en: 'Joints' },
        icon: 'bone',
        options: jointOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'cold_hands',
        type: 'radio',
        label: { ru: 'Холодные руки/ноги', en: 'Cold hands/feet' },
        icon: 'thermometer',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'headaches',
        type: 'checkbox',
        label: { ru: 'Головные боли, мигрени, травмы', en: 'Headaches, migraines, injuries' },
        icon: 'brain',
        options: headachesOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'operations',
        type: 'radio',
        label: { ru: 'Операции', en: 'Operations' },
        icon: 'scissors',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'cysts_stones',
        type: 'checkbox',
        label: { ru: 'Кисты, миомы, песок или камни в почках или желчном', en: 'Cysts, fibroids, sand or stones in kidneys or gallbladder' },
        icon: 'circle',
        options: cystsStonesOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'pressure',
        type: 'radio',
        label: { ru: 'Давление. Пьете ли таблетки (написать в дополнительно)', en: 'Blood pressure. Do you take medication (write in additional)' },
        icon: 'activity',
        options: pressureOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'menstruation',
        type: 'checkbox',
        label: { ru: 'Месячные или менопауза', en: 'Menstruation or menopause' },
        icon: 'calendar',
        options: menstruationOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'discharge_viruses',
        type: 'checkbox',
        label: { ru: 'Выделения - молочница, много родинок, бородавок, папилломавирус на коже, герпес', en: 'Discharge - thrush, many moles, warts, HPV on skin, herpes' },
        icon: 'alert-circle',
        options: dischargeMolesWartsHerpesOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'allergies',
        type: 'checkbox',
        label: { ru: 'Аллергии', en: 'Allergies' },
        icon: 'flower',
        options: allergyOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'skin_condition',
        type: 'checkbox',
        label: { ru: 'Кожа — раздражение, прыщи', en: 'Skin — irritation, acne' },
        icon: 'sparkles',
        options: skinConditionOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'sleep',
        type: 'radio',
        label: { ru: 'Сон', en: 'Sleep' },
        icon: 'moon',
        options: sleepAdultOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'energy',
        type: 'radio',
        label: { ru: 'Энергия', en: 'Energy' },
        icon: 'zap',
        options: energyOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'water_per_day',
        type: 'radio',
        label: { ru: 'Сколько воды в день (литров)', en: 'Water per day (liters)' },
        icon: 'droplet',
        options: waterOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'varicose_hemorrhoids',
        type: 'radio',
        label: { ru: 'Варикоз или геморрой', en: 'Varicose veins or hemorrhoids' },
        icon: 'heart',
        options: [
          { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
          { value: 'varicose', label: { ru: 'Варикоз', en: 'Varicose veins' } },
          { value: 'hemorrhoids', label: { ru: 'Геморрой', en: 'Hemorrhoids' } },
          { value: 'both', label: { ru: 'Оба', en: 'Both' } },
        ],
        required: true,
        hasAdditional: true,
      },
      {
        id: 'body_cleansing',
        type: 'textarea',
        label: { ru: 'Делали ли вы ранее что-то для очищения организма? Если да, то что?', en: 'Have you done anything before to cleanse your body? If yes, what?' },
        icon: 'heart',
        required: false,
        hasAdditional: false,
        placeholder: { ru: 'Опишите, если делали', en: 'Describe if you did' },
      },
      {
        id: 'main_problem',
        type: 'textarea',
        label: { ru: 'Ваша основная проблема, которую хотелось бы решить больше всего?', en: 'Your main problem that you would most like to solve?' },
        icon: 'alert-circle',
        required: false,
        hasAdditional: false,
        placeholder: { ru: 'Опишите основную проблему', en: 'Describe the main problem' },
      },
      {
        id: 'what_else',
        type: 'checkbox',
        label: { ru: 'Что ещё нужно знать о вас', en: 'What else should we know about you' },
        icon: 'info',
        required: false,
        hasAdditional: true,
        options: [
          { value: 'gv', label: { ru: 'ГВ', en: 'Breastfeeding' } },
          { value: 'pregnancy', label: { ru: 'Беременность', en: 'Pregnancy' } },
        ],
      },
      {
        id: 'how_learned',
        type: 'radio',
        label: { ru: 'Как вы обо мне узнали?', en: 'How did you learn about me?' },
        icon: 'info',
        required: false,
        hasAdditional: true,
        options: [
          { value: 'instagram', label: { ru: 'Инстаграм', en: 'Instagram' } },
          { value: 'telegram_channel', label: { ru: 'Телеграмм канал', en: 'Telegram channel' } },
          { value: 'recommendation', label: { ru: 'По рекомендации', en: 'By recommendation' } },
        ],
      },
    ],
  },
];

// Man questionnaire (type = man)
export const manQuestionnaire: QuestionnaireSection[] = [
  {
    id: 'personal',
    title: { ru: 'Личные данные', en: 'Personal Information' },
    icon: 'user',
    questions: [
      {
        id: 'name',
        type: 'text',
        label: { ru: 'Имя', en: 'Name' },
        icon: 'user',
        required: true,
        hasAdditional: false,
      },
      {
        id: 'last_name',
        type: 'text',
        label: { ru: 'Фамилия', en: 'Last Name' },
        icon: 'user',
        required: true,
        hasAdditional: false,
      },
      {
        id: 'age',
        type: 'number',
        label: { ru: 'Возраст', en: 'Age' },
        icon: 'calendar',
        required: true,
        hasAdditional: false,
      },
      {
        id: 'weight',
        type: 'number',
        label: { ru: 'Вес (кг)', en: 'Weight (kg)' },
        icon: 'scale',
        required: true,
        hasAdditional: false,
      },
    ],
  },
  {
    id: 'covid',
    title: { ru: 'COVID-19', en: 'COVID-19' },
    icon: 'shield',
    questions: [
      {
        id: 'covid_status',
        type: 'radio',
        label: { ru: 'Был ли ковид или вакцина', en: 'COVID or vaccination status' },
        icon: 'shield',
        options: covidOptionsMan,
        required: true,
        hasAdditional: true,
      },
    ],
  },
  {
    id: 'health',
    title: { ru: 'Здоровье', en: 'Health' },
    icon: 'heart',
    questions: [
      {
        id: 'weight_satisfaction',
        type: 'radio',
        label: { ru: 'Устраивает ли вас ваш вес?', en: 'Are you satisfied with your weight?' },
        icon: 'scale',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'weight_change_desire',
        type: 'radio',
        label: { ru: 'Хотели бы вы изменить вес?', en: 'Would you like to change your weight?' },
        icon: 'scale',
        options: weightSatisfactionOptions,
        required: true,
        hasAdditional: false,
      },
      {
        id: 'digestion',
        type: 'checkbox',
        label: { ru: 'Пищеварение', en: 'Digestion' },
        icon: 'heart',
        options: digestionOptionsAdult,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'varicose_hemorrhoids',
        type: 'radio',
        label: { ru: 'Варикоз или геморрой', en: 'Varicose veins or hemorrhoids' },
        icon: 'heart',
        options: [
          { value: 'no_issues', label: { ru: 'Нет проблем', en: 'No issues' } },
          { value: 'varicose', label: { ru: 'Варикоз', en: 'Varicose veins' } },
          { value: 'hemorrhoids', label: { ru: 'Геморрой', en: 'Hemorrhoids' } },
          { value: 'both', label: { ru: 'Оба', en: 'Both' } },
        ],
        required: true,
        hasAdditional: true,
      },
      {
        id: 'teeth',
        type: 'checkbox',
        label: { ru: 'Зубы', en: 'Teeth' },
        icon: 'smile',
        options: teethOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'joints',
        type: 'checkbox',
        label: { ru: 'Суставы', en: 'Joints' },
        icon: 'bone',
        options: jointOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'cold_hands',
        type: 'radio',
        label: { ru: 'Руки-ноги холодные даже летом', en: 'Cold hands/feet even in summer' },
        icon: 'thermometer',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'headaches',
        type: 'checkbox',
        label: { ru: 'Головные боли, мигрени, травмы/сотрясение', en: 'Headaches, migraines, injuries/concussion' },
        icon: 'brain',
        options: headachesOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'operations',
        type: 'radio',
        label: { ru: 'Операции', en: 'Operations' },
        icon: 'scissors',
        options: yesNoOptionsSimple,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'cysts_stones',
        type: 'checkbox',
        label: { ru: 'Кисты, песок или камни в почках/желчном', en: 'Cysts, sand or stones in kidneys/gallbladder' },
        icon: 'circle',
        options: cystsStonesKidneysOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'pressure',
        type: 'radio',
        label: { ru: 'Давление. Пьете ли таблетки (написать в дополнительно)', en: 'Blood pressure. Do you take medication (write in additional)' },
        icon: 'activity',
        options: pressureOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'water_per_day',
        type: 'radio',
        label: { ru: 'Сколько воды в день (литров)', en: 'Water per day (liters)' },
        icon: 'droplet',
        options: waterOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'skin_viruses',
        type: 'checkbox',
        label: { ru: 'Родинки, бородавки, герпес', en: 'Moles, warts, herpes' },
        icon: 'alert-circle',
        options: molesWartsHerpesOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'allergies',
        type: 'checkbox',
        label: { ru: 'Аллергия', en: 'Allergies' },
        icon: 'flower',
        options: allergyOptionsExtended,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'skin_condition',
        type: 'checkbox',
        label: { ru: 'Кожа — сухая, высыпания, раздражение, прыщи', en: 'Skin — dry, rashes, irritation, acne' },
        icon: 'sparkles',
        options: skinConditionOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'sleep',
        type: 'radio',
        label: { ru: 'Сон — трудно заснуть, часто просыпаетесь', en: 'Sleep — hard to fall asleep, wake up often' },
        icon: 'moon',
        options: sleepAdultOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'energy',
        type: 'radio',
        label: { ru: 'Энергия — с утра устал', en: 'Energy — tired in the morning' },
        icon: 'zap',
        options: energyOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'memory',
        type: 'radio',
        label: { ru: 'Память и концентрация', en: 'Memory and concentration' },
        icon: 'brain',
        options: memoryOptions,
        required: true,
        hasAdditional: true,
      },
      {
        id: 'body_cleansing',
        type: 'textarea',
        label: { ru: 'Делали ли вы ранее что-то для очищения организма? Если да, то что?', en: 'Have you done anything before to cleanse your body? If yes, what?' },
        icon: 'heart',
        required: false,
        hasAdditional: false,
        placeholder: { ru: 'Опишите, если делали', en: 'Describe if you did' },
      },
      {
        id: 'main_problem',
        type: 'textarea',
        label: { ru: 'Ваша основная проблема, которую хотелось бы решить больше всего?', en: 'Your main problem that you would most like to solve?' },
        icon: 'alert-circle',
        required: false,
        hasAdditional: false,
        placeholder: { ru: 'Опишите основную проблему', en: 'Describe the main problem' },
      },
      {
        id: 'what_else',
        type: 'textarea',
        label: { ru: 'Что ещё нужно знать', en: 'What else should we know' },
        icon: 'info',
        required: false,
        hasAdditional: false,
        placeholder: { ru: 'Дополнительная информация', en: 'Additional information' },
      },
      {
        id: 'how_learned',
        type: 'radio',
        label: { ru: 'Как вы обо мне узнали?', en: 'How did you learn about me?' },
        icon: 'info',
        required: false,
        hasAdditional: true,
        options: [
          { value: 'instagram', label: { ru: 'Инстаграм', en: 'Instagram' } },
          { value: 'telegram_channel', label: { ru: 'Телеграмм канал', en: 'Telegram channel' } },
          { value: 'recommendation', label: { ru: 'По рекомендации', en: 'By recommendation' } },
        ],
      },
    ],
  },
];

export type QuestionnaireType = 'infant' | 'child' | 'woman' | 'man';

export const getQuestionnaire = (type: QuestionnaireType): QuestionnaireSection[] => {
  switch (type) {
    case 'infant':
      return infantQuestionnaire;
    case 'child':
      return childQuestionnaire;
    case 'woman':
      return womanQuestionnaire;
    case 'man':
      return manQuestionnaire;
    default:
      return infantQuestionnaire;
  }
};

export const getQuestionnaireTitle = (type: QuestionnaireType, lang: Language): string => {
  const titles = {
    infant: { ru: 'Анкета для младенца', en: 'Infant Questionnaire' },
    child: { ru: 'Детская анкета', en: 'Child Questionnaire' },
    woman: { ru: 'Женская анкета', en: 'Women\'s Questionnaire' },
    man: { ru: 'Мужская анкета', en: 'Men\'s Questionnaire' },
  };
  return titles[type]?.[lang] || titles[type]?.ru || '';
};
