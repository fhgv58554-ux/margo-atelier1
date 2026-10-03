import {
  OccasionType,
} from '../types';
import { SupportedLanguage } from './translations';

// Campaign Assets
import occasionBridalImg from '../assets/images/margo_occasion_bridal.jpg';
import occasionEveningImg from '../assets/images/margo_occasion_evening.jpg';
import occasionSpecialImg from '../assets/images/margo_occasion_special.png';
import occasionCustomImg from '../assets/images/margo_occasion_custom.jpg';
import styleQuietLuxuryImg from '../assets/images/margo_style_quiet_luxury.jpg';
import styleContemporaryRomanticImg from '../assets/images/margo_style_contemporary_romantic.jpg';
import styleSculpturalImg from '../assets/images/margo_style_sculptural.jpg';
import styleSensualSirenImg from '../assets/images/margo_style_sensual_siren.jpg';
import columnImg from '../assets/images/margo_silhouette_column.png';
import alineImg from '../assets/images/margo_silhouette_aline.jpg';
import slipImg from '../assets/images/margo_silhouette_slip.png';
import coatDressImg from '../assets/images/margo_silhouette_coatdress.jpg';
import mermaidImg from '../assets/images/margo_silhouette_mermaid.jpg';
import fabricImg from '../assets/images/margo_fabric_detail_1789726769694.jpg';

export const CAMPAIGN_ASSETS = {
  bridal: occasionBridalImg,
  evening: occasionEveningImg,
  specialOccasion: occasionSpecialImg,
  customDress: occasionCustomImg,
  column: columnImg,
  fabric: fabricImg,
};

export interface LocalizedOccasion {
  id: OccasionType;
  title: Record<SupportedLanguage, string>;
  subtitle: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  image: string;
  tag: Record<SupportedLanguage, string>;
}

export const OCCASIONS_DATA: LocalizedOccasion[] = [
  {
    id: 'bridal',
    title: {
      ru: 'Свадебный образ',
      en: 'Bridal look',
    },
    subtitle: {
      ru: 'Современная свадебная эстетика',
      en: 'Contemporary wedding aesthetic',
    },
    description: {
      ru: 'Скульптурные архитектурные платья и струящиеся силуэты, переосмысляющие свадебную чистоту.',
      en: 'Sculptural architectural gowns and fluid silhouettes that redefine modern bridal serenity.',
    },
    image: occasionBridalImg,
    tag: {
      ru: 'Торжество',
      en: 'Celebration',
    },
  },
  {
    id: 'evening',
    title: {
      ru: 'Вечерний образ',
      en: 'Evening look',
    },
    subtitle: {
      ru: 'Вечерний выход',
      en: 'Evening outing',
    },
    description: {
      ru: 'Элегантные платья для вечернего выхода — выразительные силуэты, мягкие драпировки и красивые детали.',
      en: 'Elegant dresses for an evening out — expressive silhouettes, soft draping and beautiful details. Choose the mood that feels close to you.',
    },
    image: occasionEveningImg,
    tag: {
      ru: 'Вечерние платья',
      en: 'Evening dresses',
    },
  },
  {
    id: 'special_occasion',
    title: {
      ru: 'Образ для особого события',
      en: 'Look for a special event',
    },
    subtitle: {
      ru: 'Особое событие',
      en: 'Special event',
    },
    description: {
      ru: 'Для свадьбы близких, торжества или важной встречи — платья и элегантные комплекты, в которых вы будете чувствовать себя красиво и уверенно.',
      en: 'For a loved one’s wedding, a celebration or an important meeting — dresses and elegant sets in which you will feel beautiful and confident.',
    },
    image: occasionSpecialImg,
    tag: {
      ru: 'Особое событие',
      en: 'Special event',
    },
  },
  {
    id: 'custom_dress',
    title: {
      ru: 'Платье на заказ',
      en: 'Made-to-order dress',
    },
    subtitle: {
      ru: 'Заказ по модели',
      en: 'Order by model',
    },
    description: {
      ru: 'По Вашим эскизам подберем модель и ткань в нашем ателье. Мы обсудим посадку, детали, сроки и возможность изготовления платья по вашим меркам.',
      en: 'Choose a model and fabric in our atelier. We will discuss fit, details, timing and the possibility of making the dress to your measurements.',
    },
    image: occasionCustomImg,
    tag: {
      ru: 'Заказ по модели',
      en: 'Order by model',
    },
  },
];

export interface LocalizedSilhouette {
  id: string;
  name: Record<SupportedLanguage, string>;
  subtitle: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  image?: string;
  characteristics: Record<SupportedLanguage, string[]>;
}

export const SILHOUETTES_DATA: LocalizedSilhouette[] = [
  {
    id: 'column',
    name: {
      ru: 'Прямой силуэт / Колонна',
      en: 'Straight silhouette / Column',
    },
    subtitle: {
      ru: 'Чистые линии',
      en: 'Clean lines',
    },
    description: {
      ru: 'Лаконичное платье с узкой, почти прямой юбкой. Мягко следует линиям фигуры и создаёт спокойный, элегантный образ.',
      en: 'A laconic dress with a narrow, almost straight skirt. It softly follows the body’s lines and creates a calm, elegant look.',
    },
    image: columnImg,
    characteristics: {
      ru: ['Прямая юбка', 'Минимум объёма', 'Лаконичный крой'],
      en: ['Straight skirt', 'Minimal volume', 'Laconic cut'],
    },
  },
  {
    id: 'aline',
    name: {
      ru: 'А-силуэт',
      en: 'A-line',
    },
    subtitle: {
      ru: 'Мягкий объём',
      en: 'Soft volume',
    },
    description: {
      ru: 'Прилегающий лиф, подчёркнутая талия и юбка, постепенно расширяющаяся книзу. Сатин создаёт красивые складки и выразительный силуэт.',
      en: 'A fitted bodice, defined waist and a skirt that gradually widens toward the hem. Satin creates beautiful folds and a clear silhouette.',
    },
    image: alineImg,
    characteristics: {
      ru: ['Подчёркнутая талия', 'Расширение от талии', 'Мягкие складки'],
      en: ['Defined waist', 'Flare from the waist', 'Soft folds'],
    },
  },
  {
    id: 'slip_bias',
    name: {
      ru: 'Платье-комбинация / Крой по косой',
      en: 'Slip dress / Bias cut',
    },
    subtitle: {
      ru: 'Плавные линии',
      en: 'Fluid lines',
    },
    description: {
      ru: 'Платье на тонких бретелях с мягко струящейся юбкой. Крой по косой позволяет ткани плавно следовать линиям фигуры.',
      en: 'A thin-strap dress with a softly flowing skirt. The bias cut lets the fabric follow the body’s lines smoothly.',
    },
    image: slipImg,
    characteristics: {
      ru: ['Тонкие бретели', 'Мягкая драпировка', 'Струящаяся юбка'],
      en: ['Thin straps', 'Soft draping', 'Fluid skirt'],
    },
  },
  {
    id: 'coat_dress',
    name: {
      ru: 'Платье-жакет',
      en: 'Coat dress',
    },
    subtitle: {
      ru: 'Структура и элегантность',
      en: 'Structure & elegance',
    },
    description: {
      ru: 'Выразительная линия плеч, лацканы и приталенный крой. Современный вариант для регистрации брака, торжества или особенной встречи.',
      en: 'A clear shoulder line, lapels and a fitted cut. A modern option for a marriage registration, celebration or special meeting.',
    },
    image: coatDressImg,
    characteristics: {
      ru: ['Чёткая линия плеч', 'Лацканы', 'Приталенный крой'],
      en: ['Clear shoulder line', 'Lapels', 'Fitted cut'],
    },
  },
  {
    id: 'mermaid',
    name: {
      ru: 'Русалка / Юбка годе',
      en: 'Mermaid / Godet skirt',
    },
    subtitle: {
      ru: 'Выразительный силуэт',
      en: 'Expressive silhouette',
    },
    description: {
      ru: 'Платье облегает фигуру в области талии и бёдер, затем расширяется ближе к коленям. Выразительный силуэт с эффектной линией юбки.',
      en: 'The dress fits the waist and hips, then flares closer to the knees. An expressive silhouette with a striking skirt line.',
    },
    image: mermaidImg,
    characteristics: {
      ru: ['Прилегание по бёдрам', 'Расширение ближе к коленям', 'Шлейф — по желанию'],
      en: ['Fitted through the hips', 'Flare near the knees', 'Train — optional'],
    },
  },
  {
    id: 'undecided',
    name: {
      ru: 'Пока не определилась',
      en: 'Not decided yet',
    },
    subtitle: {
      ru: 'Дополнительный вариант',
      en: 'Additional option',
    },
    description: {
      ru: 'Хочу попробовать разные силуэты на примерке.',
      en: 'I want to try different silhouettes at the fitting.',
    },
    characteristics: {
      ru: [],
      en: [],
    },
  },
];

export interface LocalizedStyle {
  id: string;
  name: Record<SupportedLanguage, string>;
  subtitle: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  image?: string;
  moodWords: Record<SupportedLanguage, string[]>;
}

export const STYLES_DATA: LocalizedStyle[] = [
  {
    id: 'quiet_luxury',
    name: {
      ru: 'Тихая роскошь / Минимализм',
      en: 'Quiet luxury / Minimalism',
    },
    subtitle: {
      ru: 'Лаконичность и элегантность',
      en: 'Laconism and elegance',
    },
    description: {
      ru: 'Чистые линии, продуманная посадка и минимум декора. Красота образа раскрывается в силуэте, фактуре ткани и аккуратных деталях.',
      en: 'Clean lines, thoughtful fit and minimal decoration. The beauty of the look comes through in the silhouette, fabric texture and careful details.',
    },
    image: styleQuietLuxuryImg,
    moodWords: {
      ru: ['Чистые линии', 'Минимум декора', 'Выразительная фактура', 'Сдержанная элегантность'],
      en: ['Clean lines', 'Minimal decoration', 'Expressive texture', 'Restrained elegance'],
    },
  },
  {
    id: 'contemporary_romantic',
    name: {
      ru: 'Современная романтика',
      en: 'Contemporary romance',
    },
    subtitle: {
      ru: 'Нежность и мягкие линии',
      en: 'Tenderness and soft lines',
    },
    description: {
      ru: 'Мягкие драпировки, плавные линии и деликатные детали. Женственный образ, который может быть как лёгким и воздушным, так и более собранным — в зависимости от выбранной ткани.',
      en: 'Soft draping, fluid lines and delicate details. A feminine look that can feel light and airy or more composed — depending on the chosen fabric.',
    },
    image: styleContemporaryRomanticImg,
    moodWords: {
      ru: ['Мягкие складки', 'Плавные линии', 'Нежные детали', 'Лёгкость движения'],
      en: ['Soft folds', 'Fluid lines', 'Gentle details', 'Ease of movement'],
    },
  },
  {
    id: 'sculptural_avantgarde',
    name: {
      ru: 'Скульптурный / Архитектурный стиль',
      en: 'Sculptural / Architectural style',
    },
    subtitle: {
      ru: 'Выразительная форма',
      en: 'Expressive form',
    },
    description: {
      ru: 'Чёткие линии, необычные пропорции и продуманный объём. Асимметрия, выразительные складки или структурированные детали делают образ современным и запоминающимся.',
      en: 'Clear lines, unusual proportions and considered volume. Asymmetry, expressive folds or structured details make the look contemporary and memorable.',
    },
    image: styleSculpturalImg,
    moodWords: {
      ru: ['Асимметрия', 'Чёткие линии', 'Продуманный объём', 'Выразительные детали'],
      en: ['Asymmetry', 'Clear lines', 'Considered volume', 'Expressive details'],
    },
  },
  {
    id: 'sensual_siren',
    name: {
      ru: 'Чувственная элегантность',
      en: 'Sensual elegance',
    },
    subtitle: {
      ru: 'Чувственность и лёгкость',
      en: 'Sensuality and lightness',
    },
    description: {
      ru: 'Струящаяся ткань и мягкое прилегание к фигуре. Открытая спина, тонкие бретели или разрез могут стать акцентом — вы выбираете комфортную для себя степень открытости.',
      en: 'Fluid fabric and a soft fit to the figure. An open back, thin straps or a slit can become the accent — you choose the level of openness that feels comfortable.',
    },
    image: styleSensualSirenImg,
    moodWords: {
      ru: ['Струящаяся ткань', 'Мягкое прилегание', 'Открытые детали — по желанию', 'Лаконичный силуэт'],
      en: ['Fluid fabric', 'Soft fit', 'Open details — optional', 'Laconic silhouette'],
    },
  },
  {
    id: 'undecided',
    name: {
      ru: 'Пока не определилась',
      en: 'Not decided yet',
    },
    subtitle: {
      ru: 'Дополнительный вариант',
      en: 'Additional option',
    },
    description: {
      ru: 'Хочу подобрать направление вместе с вами.',
      en: 'I want to choose the direction together with you.',
    },
    moodWords: {
      ru: [],
      en: [],
    },
  },
];

export interface LocalizedColor {
  id: string;
  name: Record<SupportedLanguage, string>;
  hex: string;
  secondaryHex?: string;
  description: Record<SupportedLanguage, string>;
  paletteMood: Record<SupportedLanguage, string>;
}

export const COLOURS_DATA: LocalizedColor[] = [
  {
    id: 'white',
    name: { ru: 'Белый', en: 'White' },
    hex: '#FAFAFA',
    secondaryHex: '#F0F0F0',
    description: {
      ru: 'Чистый светлый оттенок без кремового подтона. Подчёркивает линии платья и создаёт выразительный свадебный образ.',
      en: 'A clean light shade without a creamy undertone. It emphasizes the dress lines and creates a clear bridal look.',
    },
    paletteMood: {
      ru: 'Чистота и свежесть',
      en: 'Purity and freshness',
    },
  },
  {
    id: 'ivory',
    name: { ru: 'Айвори', en: 'Ivory' },
    hex: '#F4EDE3',
    secondaryHex: '#E8DFD2',
    description: {
      ru: 'Нежный оттенок слоновой кости с лёгким тёплым подтоном. Для мягкого, изысканного свадебного образа.',
      en: 'A soft ivory shade with a light warm undertone. For a gentle, refined bridal look.',
    },
    paletteMood: {
      ru: 'Мягкость и элегантность',
      en: 'Softness and elegance',
    },
  },
  {
    id: 'light_champagne',
    name: { ru: 'Светлый шампань', en: 'Light champagne' },
    hex: '#E9DFD0',
    secondaryHex: '#DCCFBA',
    description: {
      ru: 'Светлый бежевый оттенок с золотистым подтоном. Мягко раскрывается в сатине и добавляет образу теплоту.',
      en: 'A light beige shade with a golden undertone. It softens beautifully in satin and adds warmth to the look.',
    },
    paletteMood: {
      ru: 'Деликатное сияние',
      en: 'Delicate glow',
    },
  },
  {
    id: 'sand',
    name: { ru: 'Песочный', en: 'Sand' },
    hex: '#D6C7B0',
    secondaryHex: '#C7B69A',
    description: {
      ru: 'Сдержанный тёплый бежевый, вдохновлённый прибрежным песком. Для лаконичных платьев и элегантных комплектов.',
      en: 'A restrained warm beige inspired by coastal sand. For laconic dresses and elegant sets.',
    },
    paletteMood: {
      ru: 'Естественность и спокойствие',
      en: 'Natural calm',
    },
  },
  {
    id: 'powder_rose',
    name: { ru: 'Пудровая роза', en: 'Powder rose' },
    hex: '#E8D0CB',
    secondaryHex: '#D9B8B3',
    description: {
      ru: 'Приглушённый розовый оттенок с мягким сиянием. Красиво сочетается с плавными линиями и деликатными драпировками.',
      en: 'A muted pink shade with a soft glow. It pairs beautifully with fluid lines and delicate draping.',
    },
    paletteMood: {
      ru: 'Нежность и романтика',
      en: 'Tenderness and romance',
    },
  },
  {
    id: 'rose_lilac',
    name: { ru: 'Розово-лиловый', en: 'Rose lilac' },
    hex: '#DCC9D6',
    secondaryHex: '#C9B3C5',
    description: {
      ru: 'Нежный розовый с лёгким лиловым подтоном. Для романтичного образа с современным характером.',
      en: 'A soft pink with a light lilac undertone. For a romantic look with a contemporary character.',
    },
    paletteMood: {
      ru: 'Прохладная утончённость',
      en: 'Cool refinement',
    },
  },
  {
    id: 'peach',
    name: { ru: 'Персиковый', en: 'Peach' },
    hex: '#F0D5C4',
    secondaryHex: '#E4C0AA',
    description: {
      ru: 'Светлый тёплый оттенок с розово-абрикосовым подтоном. Добавляет образу свежесть и мягкое солнечное настроение.',
      en: 'A light warm shade with a rose-apricot undertone. It brings freshness and a soft sunny mood.',
    },
    paletteMood: {
      ru: 'Тепло и мягкость',
      en: 'Warmth and softness',
    },
  },
  {
    id: 'orange',
    name: { ru: 'Оранжевый', en: 'Orange' },
    hex: '#D86B35',
    secondaryHex: '#C45A28',
    description: {
      ru: 'Насыщенный тёплый цвет для смелого образа. Эффектно раскрывается в сиянии сатина и крупных складках.',
      en: 'A rich warm colour for a bold look. It shines beautifully in satin and large folds.',
    },
    paletteMood: {
      ru: 'Энергия и выразительность',
      en: 'Energy and expression',
    },
  },
  {
    id: 'soft_blue',
    name: { ru: 'Нежно-голубой', en: 'Soft blue' },
    hex: '#C8D8E6',
    secondaryHex: '#B3C7DA',
    description: {
      ru: 'Мягкий светло-голубой оттенок, напоминающий ясное небо над океаном. Для воздушного и элегантного образа.',
      en: 'A soft light-blue shade reminiscent of clear sky above the ocean. For an airy and elegant look.',
    },
    paletteMood: {
      ru: 'Лёгкость и свежесть',
      en: 'Lightness and freshness',
    },
  },
  {
    id: 'burgundy',
    name: { ru: 'Бордовый', en: 'Burgundy' },
    hex: '#6E1F2C',
    secondaryHex: '#541821',
    description: {
      ru: 'Богатый винный оттенок с выразительным сиянием. Для вечерних платьев, торжественных событий и особых случаев.',
      en: 'A rich wine shade with expressive glow. For evening dresses, celebrations and special occasions.',
    },
    paletteMood: {
      ru: 'Глубина и изысканность',
      en: 'Depth and refinement',
    },
  },
  {
    id: 'navy',
    name: { ru: 'Тёмно-синий · Navy', en: 'Deep navy' },
    hex: '#1A2744',
    secondaryHex: '#121C33',
    description: {
      ru: 'Глубокий тёмно-синий оттенок для утончённого вечернего образа. Подчёркивает чистоту кроя и мягкие переливы сатина.',
      en: 'A deep navy shade for a refined evening look. It emphasizes clean cutting and soft satin reflections.',
    },
    paletteMood: {
      ru: 'Сдержанная элегантность',
      en: 'Restrained elegance',
    },
  },
  {
    id: 'black',
    name: { ru: 'Чёрный', en: 'Black' },
    hex: '#141414',
    secondaryHex: '#2A2A2A',
    description: {
      ru: 'Вневременной вечерний цвет. Подчёркивает силуэт, открытые линии и контраст между светом и складками ткани.',
      en: 'A timeless evening colour. It emphasizes silhouette, open lines and the contrast between light and fabric folds.',
    },
    paletteMood: {
      ru: 'Классика и выразительность',
      en: 'Classic expression',
    },
  },
  {
    id: 'undecided',
    name: { ru: 'Пока не определилась', en: 'Not decided yet' },
    hex: '#EDE8E1',
    secondaryHex: '#E0DAD2',
    description: {
      ru: 'Хочу обсудить оттенки и выбрать подходящий цвет на консультации.',
      en: 'I want to discuss shades and choose a suitable colour at the consultation.',
    },
    paletteMood: {
      ru: 'Подберём вместе',
      en: 'We will choose together',
    },
  },
];

export interface LocalizedBudget {
  id: string;
  range: string;
  tier: Record<SupportedLanguage, string>;
  prices: Record<SupportedLanguage, string[]>;
  description: Record<SupportedLanguage, string>;
  includes: Record<SupportedLanguage, string[]>;
  note: Record<SupportedLanguage, string>;
}

export const BUDGET_TIERS_DATA: LocalizedBudget[] = [
  {
    id: 'tier_signature',
    range: 'MARGO Signature',
    tier: {
      ru: 'MARGO Signature · Наша коллекция',
      en: 'MARGO Signature · Our Collection',
    },
    prices: {
      ru: ['Вечерние платья: R4 500–R9 000', 'Свадебные платья: R10 000–R18 000'],
      en: ['Evening dresses: R4 500–R9 000', 'Bridal dresses: R10 000–R18 000'],
    },
    description: {
      ru: 'Фирменные модели MARGO из сатина и других выбранных тканей — чистые линии, женственные силуэты и выразительные драпировки.',
      en: 'Signature MARGO designs in satin and other selected fabrics — clean lines, feminine silhouettes and expressive draping.',
    },
    includes: {
      ru: [
        'Выбор модели из коллекции MARGO.',
        'Подбор доступной ткани и цвета.',
        'Обсуждение посадки и возможных изменений.',
        'Готовое платье или изготовление по выбранной модели.',
      ],
      en: [
        'Choosing a design from the MARGO collection.',
        'Selecting available fabric and colour.',
        'Discussing fit and possible adjustments.',
        'A ready dress or made-to-order from a chosen model.',
      ],
    },
    note: {
      ru: 'Наличие, возможность изменений и стоимость подгонки уточняются для конкретного платья.',
      en: 'Availability, possible alterations and fitting costs are confirmed for each specific dress.',
    },
  },
  {
    id: 'tier_bespoke',
    range: 'MARGO Bespoke',
    tier: {
      ru: 'MARGO Bespoke · Индивидуальный дизайн',
      en: 'MARGO Bespoke · Individual Design',
    },
    prices: {
      ru: ['Вечерние платья: R12 000–R25 000', 'Свадебные платья: R18 000–R35 000'],
      en: ['Evening dresses: R12 000–R25 000', 'Bridal dresses: R18 000–R35 000'],
    },
    description: {
      ru: 'Платье, разработанное с учётом вашего события, фигуры и личного стиля.',
      en: 'A dress developed around your event, figure and personal style.',
    },
    includes: {
      ru: [
        'Обсуждение идеи и разработка дизайна.',
        'Подбор силуэта, декольте, рукавов и деталей.',
        'Выбор тканей в рамках согласованного бюджета.',
        'Изготовление по меркам и примерки по плану заказа.',
      ],
      en: [
        'Discussing the idea and developing the design.',
        'Choosing silhouette, neckline, sleeves and details.',
        'Selecting fabrics within the agreed budget.',
        'Made-to-measure production and fittings as planned.',
      ],
    },
    note: {
      ru: 'Дизайн, состав работ и сроки согласовываются индивидуально.',
      en: 'Design, scope of work and timelines are agreed individually.',
    },
  },
  {
    id: 'tier_couture',
    range: 'MARGO Couture',
    tier: {
      ru: 'MARGO Couture · Эксклюзивный проект',
      en: 'MARGO Couture · Exclusive Project',
    },
    prices: {
      ru: ['Ориентировочно R30 000–R60 000+', 'По индивидуальному запросу.'],
      en: ['Approximately R30 000–R60 000+', 'By individual request.'],
    },
    description: {
      ru: 'Для особенного образа со сложной конструкцией, выразительными деталями и тщательно продуманной отделкой.',
      en: 'For a special look with complex construction, expressive details and carefully considered finishing.',
    },
    includes: {
      ru: [
        'Индивидуальная разработка модели.',
        'Работа с объёмом, драпировками и конструкцией.',
        'Подбор тканей и декоративных элементов.',
        'Макет и дополнительные примерки при необходимости.',
      ],
      en: [
        'Individual model development.',
        'Work with volume, draping and construction.',
        'Selecting fabrics and decorative elements.',
        'A toile and additional fittings when needed.',
      ],
    },
    note: {
      ru: 'Возможность реализации, материалы, отделка и стоимость определяются после обсуждения проекта.',
      en: 'Feasibility, materials, finishing and cost are defined after discussing the project.',
    },
  },
];

export interface LocalizedPriority {
  id: string;
  label: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
}

export const PRIORITIES_DATA: LocalizedPriority[] = [
  {
    id: 'fabric_quality',
    label: {
      ru: 'Благородные Ткани и Тактильность',
      en: 'Noble Fabrics & Tactile Luxury',
    },
    description: {
      ru: 'Чувственное прикосновение натуральных тканей.',
      en: 'The sensual touch of natural fabrics.',
    },
  },
  {
    id: 'architectural_silhouette',
    label: {
      ru: 'Архитектурный Крой и Точность Линий',
      en: 'Architectural Cut & Precision Line',
    },
    description: {
      ru: 'Безупречная скульптурная осанка, чистые рельефные линии и выразительный силуэт.',
      en: 'Flawless geometric posture, clean seamlines, and striking profile.',
    },
  },
  {
    id: 'effortless_comfort',
    label: {
      ru: 'Комфорт и Естественная Свобода Движений',
      en: 'Comfort & Fluid Ease of Movement',
    },
    description: {
      ru: 'Свобода естественно двигаться, танцевать и дышать без жесткого дискомфорта.',
      en: 'Freedom to walk, dance, and breathe naturally without rigid discomfort.',
    },
  },
  {
    id: 'timeless_elegance',
    label: {
      ru: 'Вне Времени: Долговечность Стиля',
      en: 'Timelessness Over Passing Trends',
    },
    description: {
      ru: 'Образ, который будет выглядеть так же величественно и чисто через 30 лет.',
      en: 'A look that will appear just as striking and pure in 30 years.',
    },
  },
  {
    id: 'hand_craftsmanship',
    label: {
      ru: 'Артизанальное Ручное Мастерство',
      en: 'Artisanal Hand-Finishing',
    },
    description: {
      ru: 'Невидимые ручные подгибы, внутренняя корсетная лента и ювелирная точность швов.',
      en: 'Invisible hand-stitched hems, bespoke interior corsetry, and artisanal details.',
    },
  },
];

export const TIMELINE_OPTIONS_DATA = [
  {
    id: 'under1m',
    label: { ru: 'Меньше месяца', en: 'Less than a month' },
  },
  {
    id: '1-2m',
    label: { ru: '1–2 месяца', en: '1–2 months' },
  },
  {
    id: '3-5m',
    label: { ru: '3–5 месяцев', en: '3–5 months' },
  },
  {
    id: '6m+',
    label: { ru: '6 месяцев и более', en: '6 months or more' },
  },
  {
    id: 'undecided',
    label: { ru: 'Дата пока не определена', en: 'Date not yet decided' },
  },
];

export const EVENT_SETTINGS_DATA = [
  {
    id: 'coast',
    label: { ru: 'На побережье / На пляже', en: 'Coastal / Beach' },
  },
  {
    id: 'garden',
    label: { ru: 'В саду / На открытом воздухе', en: 'Garden / Outdoors' },
  },
  {
    id: 'wine_estate',
    label: { ru: 'На винной ферме / В загородном поместье', en: 'Wine farm / Country estate' },
  },
  {
    id: 'hotel',
    label: { ru: 'В отеле / Ресторане / Банкетном зале', en: 'Hotel / Restaurant / Banquet hall' },
  },
  {
    id: 'black_tie',
    label: { ru: 'Официальный вечер / Black Tie', en: 'Formal evening / Black Tie' },
  },
  {
    id: 'family',
    label: { ru: 'Небольшое семейное торжество', en: 'Small family celebration' },
  },
  {
    id: 'other',
    label: { ru: 'Другой вариант', en: 'Other' },
  },
  {
    id: 'undecided',
    label: { ru: 'Место пока не выбрано', en: 'Venue not chosen yet' },
  },
];

/** Derive timeline label from an exact event date so we don't ask twice. */
export function timelineLabelFromDate(dateStr: string, lang: SupportedLanguage): string {
  if (!dateStr) return '';
  const event = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(event.getTime())) return '';

  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const days = Math.ceil((event.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const months = days / 30.4375;

  let id: string;
  if (months < 1) id = 'under1m';
  else if (months < 3) id = '1-2m';
  else if (months < 6) id = '3-5m';
  else id = '6m+';

  return TIMELINE_OPTIONS_DATA.find((t) => t.id === id)?.label[lang] ?? '';
}

export const ATELIER_LOCATIONS_DATA = [
  {
    id: 'south_africa',
    name: { ru: 'Южная Африка', en: 'South Africa' },
    type: 'in_person',
  },
  {
    id: 'online',
    name: { ru: 'Онлайн', en: 'Online' },
    type: 'virtual',
  },
];

export const FIT_PREFERENCES_DATA = [
  {
    id: 'defined_waist',
    title: {
      ru: 'Подчёркнутая талия и поддержка',
      en: 'Defined waist and support',
    },
    desc: {
      ru: 'Мне нравится чёткая линия талии и ощущение поддержки в области лифа. Степень прилегания обсудим на консультации.',
      en: 'I like a clear waistline and a feeling of support in the bodice. We will discuss how close the fit should be at the consultation.',
    },
  },
  {
    id: 'soft_contour',
    title: {
      ru: 'Мягкое облегание',
      en: 'Soft contour',
    },
    desc: {
      ru: 'Хочу, чтобы ткань плавно следовала линиям фигуры, сохраняя лёгкость и комфорт.',
      en: 'I want the fabric to follow the body softly while staying light and comfortable.',
    },
  },
  {
    id: 'defined_shape',
    title: {
      ru: 'Чёткая форма',
      en: 'Defined shape',
    },
    desc: {
      ru: 'Мне близки собранный силуэт, выразительная линия плеч и ткань, которая держит форму.',
      en: 'I prefer a composed silhouette, a clear shoulder line and fabric that holds its shape.',
    },
  },
  {
    id: 'ease_of_movement',
    title: {
      ru: 'Свобода движений',
      en: 'Ease of movement',
    },
    desc: {
      ru: 'Предпочитаю более свободную посадку, чтобы было удобно ходить, сидеть и танцевать.',
      en: 'I prefer a freer fit so it is comfortable to walk, sit and dance.',
    },
  },
  {
    id: 'need_help',
    title: {
      ru: 'Нужна помощь с выбором',
      en: 'Need help choosing',
    },
    desc: {
      ru: 'Хочу обсудить варианты и подобрать комфортную посадку на консультации.',
      en: 'I want to discuss options and choose a comfortable fit at the consultation.',
    },
  },
];

export const INSPIRATION_TAGS_DATA = {
  ru: [
    'Архитектурный вырез-лодочка',
    'Низкая чувственная спина',
    'Струящееся платье-комбинация',
    'Тяжелый шелковый креп (Комо)',
    'Съемный шелковый шлейф',
    'Микроплиссированный шифон',
    'Минималистичное платье-пальто',
    'Мягкая драпировка-водопад',
  ],
  en: [
    'Architectural Boatneck',
    'Low Sensual Back',
    'Fluid Bias Slip',
    'Como Heavy Silk Crêpe',
    'Detachable Silk Train',
    'Micro-Pleated Chiffon',
    'Minimalist Tailored Coat',
    'Soft Draped Cowl',
  ],
};

export const SIZES_DATA = [
  'EU 34 (RU 40 / US 2)',
  'EU 36 (RU 42 / US 4)',
  'EU 38 (RU 44 / US 6)',
  'EU 40 (RU 46 / US 8)',
  'EU 42 (RU 48 / US 10)',
  'EU 44 (RU 50 / US 12)',
  'Индивидуальный пошив (Bespoke)',
];

// Helper getters for backwards compatibility
export const getOccasions = (lang: SupportedLanguage) =>
  OCCASIONS_DATA.map((o) => ({
    id: o.id,
    title: o.title[lang],
    subtitle: o.subtitle[lang],
    description: o.description[lang],
    image: o.image,
    tag: o.tag[lang],
  }));

export const getSilhouettes = (lang: SupportedLanguage) =>
  SILHOUETTES_DATA.map((s) => ({
    id: s.id,
    name: s.name[lang],
    subtitle: s.subtitle[lang],
    description: s.description[lang],
    image: s.image,
    characteristics: s.characteristics[lang],
  }));

export const getStyles = (lang: SupportedLanguage) =>
  STYLES_DATA.map((s) => ({
    id: s.id,
    name: s.name[lang],
    subtitle: s.subtitle[lang],
    description: s.description[lang],
    image: s.image,
    moodWords: s.moodWords[lang],
  }));

export const getColours = (lang: SupportedLanguage) =>
  COLOURS_DATA.map((c) => ({
    id: c.id,
    name: c.name[lang],
    hex: c.hex,
    secondaryHex: c.secondaryHex,
    description: c.description[lang],
    paletteMood: c.paletteMood[lang],
  }));

export const getBudgetTiers = (lang: SupportedLanguage) =>
  BUDGET_TIERS_DATA.map((b) => ({
    id: b.id,
    range: b.range,
    tier: b.tier[lang],
    prices: b.prices[lang],
    description: b.description[lang],
    includes: b.includes[lang],
    note: b.note[lang],
  }));

export const getPriorities = (lang: SupportedLanguage) =>
  PRIORITIES_DATA.map((p) => ({
    id: p.id,
    label: p.label[lang],
    description: p.description[lang],
  }));

export const getTimelineOptions = (lang: SupportedLanguage) =>
  TIMELINE_OPTIONS_DATA.map((t) => ({
    id: t.id,
    label: t.label[lang],
  }));

export const getEventSettings = (lang: SupportedLanguage) =>
  EVENT_SETTINGS_DATA.map((s) => ({
    id: s.id,
    label: s.label[lang],
  }));

export const getAtelierLocations = (lang: SupportedLanguage) =>
  ATELIER_LOCATIONS_DATA.map((l) => ({
    id: l.id,
    name: l.name[lang],
    type: l.type,
  }));

export const getFitPreferences = (lang: SupportedLanguage) =>
  FIT_PREFERENCES_DATA.map((f) => ({
    id: f.id,
    title: f.title[lang],
    desc: f.desc[lang],
  }));

// Default exports in Russian
export const OCCASIONS = getOccasions('ru');
export const SILHOUETTES = getSilhouettes('ru');
export const STYLES = getStyles('ru');
export const COLOURS = getColours('ru');
export const BUDGET_TIERS = getBudgetTiers('ru');
export const PRIORITIES = getPriorities('ru');
export const TIMELINE_OPTIONS = getTimelineOptions('ru');
export const ATELIER_LOCATIONS = getAtelierLocations('ru');
export const FIT_PREFERENCES = getFitPreferences('ru');

