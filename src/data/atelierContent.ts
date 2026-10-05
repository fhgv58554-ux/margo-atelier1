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
      en: 'Bridal look',
    },
    subtitle: {
      en: 'Contemporary wedding aesthetic',
    },
    description: {
      en: 'Sculptural architectural gowns and fluid silhouettes that redefine modern bridal serenity.',
    },
    image: occasionBridalImg,
    tag: {
      en: 'Celebration',
    },
  },
  {
    id: 'evening',
    title: {
      en: 'Evening look',
    },
    subtitle: {
      en: 'Evening outing',
    },
    description: {
      en: 'Elegant dresses for an evening out — expressive silhouettes, soft draping and beautiful details. Choose the mood that feels close to you.',
    },
    image: occasionEveningImg,
    tag: {
      en: 'Evening dresses',
    },
  },
  {
    id: 'special_occasion',
    title: {
      en: 'Look for a special event',
    },
    subtitle: {
      en: 'Special event',
    },
    description: {
      en: 'For a loved one’s wedding, a celebration or an important meeting — dresses and elegant sets in which you will feel beautiful and confident.',
    },
    image: occasionSpecialImg,
    tag: {
      en: 'Special event',
    },
  },
  {
    id: 'custom_dress',
    title: {
      en: 'Made-to-order dress',
    },
    subtitle: {
      en: 'Order by model',
    },
    description: {
      en: 'Choose a model and fabric in our atelier. We will discuss fit, details, timing and the possibility of making the dress to your measurements.',
    },
    image: occasionCustomImg,
    tag: {
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
      en: 'Straight silhouette / Column',
    },
    subtitle: {
      en: 'Clean lines',
    },
    description: {
      en: 'A laconic dress with a narrow, almost straight skirt. It softly follows the body’s lines and creates a calm, elegant look.',
    },
    image: columnImg,
    characteristics: {
      en: ['Straight skirt', 'Minimal volume', 'Laconic cut'],
    },
  },
  {
    id: 'aline',
    name: {
      en: 'A-line',
    },
    subtitle: {
      en: 'Soft volume',
    },
    description: {
      en: 'A fitted bodice, defined waist and a skirt that gradually widens toward the hem. Satin creates beautiful folds and a clear silhouette.',
    },
    image: alineImg,
    characteristics: {
      en: ['Defined waist', 'Flare from the waist', 'Soft folds'],
    },
  },
  {
    id: 'slip_bias',
    name: {
      en: 'Slip dress / Bias cut',
    },
    subtitle: {
      en: 'Fluid lines',
    },
    description: {
      en: 'A thin-strap dress with a softly flowing skirt. The bias cut lets the fabric follow the body’s lines smoothly.',
    },
    image: slipImg,
    characteristics: {
      en: ['Thin straps', 'Soft draping', 'Fluid skirt'],
    },
  },
  {
    id: 'coat_dress',
    name: {
      en: 'Coat dress',
    },
    subtitle: {
      en: 'Structure & elegance',
    },
    description: {
      en: 'A clear shoulder line, lapels and a fitted cut. A modern option for a marriage registration, celebration or special meeting.',
    },
    image: coatDressImg,
    characteristics: {
      en: ['Clear shoulder line', 'Lapels', 'Fitted cut'],
    },
  },
  {
    id: 'mermaid',
    name: {
      en: 'Mermaid / Godet skirt',
    },
    subtitle: {
      en: 'Expressive silhouette',
    },
    description: {
      en: 'The dress fits the waist and hips, then flares closer to the knees. An expressive silhouette with a striking skirt line.',
    },
    image: mermaidImg,
    characteristics: {
      en: ['Fitted through the hips', 'Flare near the knees', 'Train — optional'],
    },
  },
  {
    id: 'undecided',
    name: {
      en: 'Not decided yet',
    },
    subtitle: {
      en: 'Additional option',
    },
    description: {
      en: 'I want to try different silhouettes at the fitting.',
    },
    characteristics: {
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
      en: 'Quiet luxury / Minimalism',
    },
    subtitle: {
      en: 'Laconism and elegance',
    },
    description: {
      en: 'Clean lines, thoughtful fit and minimal decoration. The beauty of the look comes through in the silhouette, fabric texture and careful details.',
    },
    image: styleQuietLuxuryImg,
    moodWords: {
      en: ['Clean lines', 'Minimal decoration', 'Expressive texture', 'Restrained elegance'],
    },
  },
  {
    id: 'contemporary_romantic',
    name: {
      en: 'Contemporary romance',
    },
    subtitle: {
      en: 'Tenderness and soft lines',
    },
    description: {
      en: 'Soft draping, fluid lines and delicate details. A feminine look that can feel light and airy or more composed — depending on the chosen fabric.',
    },
    image: styleContemporaryRomanticImg,
    moodWords: {
      en: ['Soft folds', 'Fluid lines', 'Gentle details', 'Ease of movement'],
    },
  },
  {
    id: 'sculptural_avantgarde',
    name: {
      en: 'Sculptural / Architectural style',
    },
    subtitle: {
      en: 'Expressive form',
    },
    description: {
      en: 'Clear lines, unusual proportions and considered volume. Asymmetry, expressive folds or structured details make the look contemporary and memorable.',
    },
    image: styleSculpturalImg,
    moodWords: {
      en: ['Asymmetry', 'Clear lines', 'Considered volume', 'Expressive details'],
    },
  },
  {
    id: 'sensual_siren',
    name: {
      en: 'Sensual elegance',
    },
    subtitle: {
      en: 'Sensuality and lightness',
    },
    description: {
      en: 'Fluid fabric and a soft fit to the figure. An open back, thin straps or a slit can become the accent — you choose the level of openness that feels comfortable.',
    },
    image: styleSensualSirenImg,
    moodWords: {
      en: ['Fluid fabric', 'Soft fit', 'Open details — optional', 'Laconic silhouette'],
    },
  },
  {
    id: 'undecided',
    name: {
      en: 'Not decided yet',
    },
    subtitle: {
      en: 'Additional option',
    },
    description: {
      en: 'I want to choose the direction together with you.',
    },
    moodWords: {
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
    name: { en: 'White' },
    hex: '#FAFAFA',
    secondaryHex: '#F0F0F0',
    description: {
      en: 'A clean light shade without a creamy undertone. It emphasizes the dress lines and creates a clear bridal look.',
    },
    paletteMood: {
      en: 'Purity and freshness',
    },
  },
  {
    id: 'ivory',
    name: { en: 'Ivory' },
    hex: '#F4EDE3',
    secondaryHex: '#E8DFD2',
    description: {
      en: 'A soft ivory shade with a light warm undertone. For a gentle, refined bridal look.',
    },
    paletteMood: {
      en: 'Softness and elegance',
    },
  },
  {
    id: 'light_champagne',
    name: { en: 'Light champagne' },
    hex: '#E9DFD0',
    secondaryHex: '#DCCFBA',
    description: {
      en: 'A light beige shade with a golden undertone. It softens beautifully in satin and adds warmth to the look.',
    },
    paletteMood: {
      en: 'Delicate glow',
    },
  },
  {
    id: 'sand',
    name: { en: 'Sand' },
    hex: '#D6C7B0',
    secondaryHex: '#C7B69A',
    description: {
      en: 'A restrained warm beige inspired by coastal sand. For laconic dresses and elegant sets.',
    },
    paletteMood: {
      en: 'Natural calm',
    },
  },
  {
    id: 'powder_rose',
    name: { en: 'Powder rose' },
    hex: '#E8D0CB',
    secondaryHex: '#D9B8B3',
    description: {
      en: 'A muted pink shade with a soft glow. It pairs beautifully with fluid lines and delicate draping.',
    },
    paletteMood: {
      en: 'Tenderness and romance',
    },
  },
  {
    id: 'rose_lilac',
    name: { en: 'Rose lilac' },
    hex: '#DCC9D6',
    secondaryHex: '#C9B3C5',
    description: {
      en: 'A soft pink with a light lilac undertone. For a romantic look with a contemporary character.',
    },
    paletteMood: {
      en: 'Cool refinement',
    },
  },
  {
    id: 'peach',
    name: { en: 'Peach' },
    hex: '#F0D5C4',
    secondaryHex: '#E4C0AA',
    description: {
      en: 'A light warm shade with a rose-apricot undertone. It brings freshness and a soft sunny mood.',
    },
    paletteMood: {
      en: 'Warmth and softness',
    },
  },
  {
    id: 'orange',
    name: { en: 'Orange' },
    hex: '#D86B35',
    secondaryHex: '#C45A28',
    description: {
      en: 'A rich warm colour for a bold look. It shines beautifully in satin and large folds.',
    },
    paletteMood: {
      en: 'Energy and expression',
    },
  },
  {
    id: 'soft_blue',
    name: { en: 'Soft blue' },
    hex: '#C8D8E6',
    secondaryHex: '#B3C7DA',
    description: {
      en: 'A soft light-blue shade reminiscent of clear sky above the ocean. For an airy and elegant look.',
    },
    paletteMood: {
      en: 'Lightness and freshness',
    },
  },
  {
    id: 'burgundy',
    name: { en: 'Burgundy' },
    hex: '#6E1F2C',
    secondaryHex: '#541821',
    description: {
      en: 'A rich wine shade with expressive glow. For evening dresses, celebrations and special occasions.',
    },
    paletteMood: {
      en: 'Depth and refinement',
    },
  },
  {
    id: 'navy',
    name: { en: 'Deep navy' },
    hex: '#1A2744',
    secondaryHex: '#121C33',
    description: {
      en: 'A deep navy shade for a refined evening look. It emphasizes clean cutting and soft satin reflections.',
    },
    paletteMood: {
      en: 'Restrained elegance',
    },
  },
  {
    id: 'black',
    name: { en: 'Black' },
    hex: '#141414',
    secondaryHex: '#2A2A2A',
    description: {
      en: 'A timeless evening colour. It emphasizes silhouette, open lines and the contrast between light and fabric folds.',
    },
    paletteMood: {
      en: 'Classic expression',
    },
  },
  {
    id: 'undecided',
    name: { en: 'Not decided yet' },
    hex: '#EDE8E1',
    secondaryHex: '#E0DAD2',
    description: {
      en: 'I want to discuss shades and choose a suitable colour at the consultation.',
    },
    paletteMood: {
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
      en: 'MARGO Signature · Our Collection',
    },
    prices: {
      en: ['Evening dresses: R4 500–R9 000', 'Bridal dresses: R10 000–R18 000'],
    },
    description: {
      en: 'Signature MARGO designs in satin and other selected fabrics — clean lines, feminine silhouettes and expressive draping.',
    },
    includes: {
      en: [
        'Choosing a design from the MARGO collection.',
        'Selecting available fabric and colour.',
        'Discussing fit and possible adjustments.',
        'A ready dress or made-to-order from a chosen model.',
      ],
    },
    note: {
      en: 'Availability, possible alterations and fitting costs are confirmed for each specific dress.',
    },
  },
  {
    id: 'tier_bespoke',
    range: 'MARGO Bespoke',
    tier: {
      en: 'MARGO Bespoke · Individual Design',
    },
    prices: {
      en: ['Evening dresses: R12 000–R25 000', 'Bridal dresses: R18 000–R35 000'],
    },
    description: {
      en: 'A dress developed around your event, figure and personal style.',
    },
    includes: {
      en: [
        'Discussing the idea and developing the design.',
        'Choosing silhouette, neckline, sleeves and details.',
        'Selecting fabrics within the agreed budget.',
        'Made-to-measure production and fittings as planned.',
      ],
    },
    note: {
      en: 'Design, scope of work and timelines are agreed individually.',
    },
  },
  {
    id: 'tier_couture',
    range: 'MARGO Couture',
    tier: {
      en: 'MARGO Couture · Exclusive Project',
    },
    prices: {
      en: ['Approximately R30 000–R60 000+', 'By individual request.'],
    },
    description: {
      en: 'For a special look with complex construction, expressive details and carefully considered finishing.',
    },
    includes: {
      en: [
        'Individual model development.',
        'Work with volume, draping and construction.',
        'Selecting fabrics and decorative elements.',
        'A toile and additional fittings when needed.',
      ],
    },
    note: {
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
      en: 'Noble Fabrics & Tactile Luxury',
    },
    description: {
      en: 'The sensual touch of natural fabrics.',
    },
  },
  {
    id: 'architectural_silhouette',
    label: {
      en: 'Architectural Cut & Precision Line',
    },
    description: {
      en: 'Flawless geometric posture, clean seamlines, and striking profile.',
    },
  },
  {
    id: 'effortless_comfort',
    label: {
      en: 'Comfort & Fluid Ease of Movement',
    },
    description: {
      en: 'Freedom to walk, dance, and breathe naturally without rigid discomfort.',
    },
  },
  {
    id: 'timeless_elegance',
    label: {
      en: 'Timelessness Over Passing Trends',
    },
    description: {
      en: 'A look that will appear just as striking and pure in 30 years.',
    },
  },
  {
    id: 'hand_craftsmanship',
    label: {
      en: 'Artisanal Hand-Finishing',
    },
    description: {
      en: 'Invisible hand-stitched hems, bespoke interior corsetry, and artisanal details.',
    },
  },
];

export const TIMELINE_OPTIONS_DATA = [
  {
    id: 'under1m',
    label: { en: 'Less than a month' },
  },
  {
    id: '1-2m',
    label: { en: '1–2 months' },
  },
  {
    id: '3-5m',
    label: { en: '3–5 months' },
  },
  {
    id: '6m+',
    label: { en: '6 months or more' },
  },
  {
    id: 'undecided',
    label: { en: 'Date not yet decided' },
  },
];

export const EVENT_SETTINGS_DATA = [
  {
    id: 'coast',
    label: { en: 'Coastal / Beach' },
  },
  {
    id: 'garden',
    label: { en: 'Garden / Outdoors' },
  },
  {
    id: 'wine_estate',
    label: { en: 'Wine farm / Country estate' },
  },
  {
    id: 'hotel',
    label: { en: 'Hotel / Restaurant / Banquet hall' },
  },
  {
    id: 'black_tie',
    label: { en: 'Formal evening / Black Tie' },
  },
  {
    id: 'family',
    label: { en: 'Small family celebration' },
  },
  {
    id: 'other',
    label: { en: 'Other' },
  },
  {
    id: 'undecided',
    label: { en: 'Venue not chosen yet' },
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
    name: { en: 'South Africa' },
    type: 'in_person',
  },
  {
    id: 'online',
    name: { en: 'Online' },
    type: 'virtual',
  },
];

export const FIT_PREFERENCES_DATA = [
  {
    id: 'defined_waist',
    title: {
      en: 'Defined waist and support',
    },
    desc: {
      en: 'I like a clear waistline and a feeling of support in the bodice. We will discuss how close the fit should be at the consultation.',
    },
  },
  {
    id: 'soft_contour',
    title: {
      en: 'Soft contour',
    },
    desc: {
      en: 'I want the fabric to follow the body softly while staying light and comfortable.',
    },
  },
  {
    id: 'defined_shape',
    title: {
      en: 'Defined shape',
    },
    desc: {
      en: 'I prefer a composed silhouette, a clear shoulder line and fabric that holds its shape.',
    },
  },
  {
    id: 'ease_of_movement',
    title: {
      en: 'Ease of movement',
    },
    desc: {
      en: 'I prefer a freer fit so it is comfortable to walk, sit and dance.',
    },
  },
  {
    id: 'need_help',
    title: {
      en: 'Need help choosing',
    },
    desc: {
      en: 'I want to discuss options and choose a comfortable fit at the consultation.',
    },
  },
];

export const INSPIRATION_TAGS_DATA = {
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
  'Bespoke',
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

// Default exports in English
export const OCCASIONS = getOccasions('en');
export const SILHOUETTES = getSilhouettes('en');
export const STYLES = getStyles('en');
export const COLOURS = getColours('en');
export const BUDGET_TIERS = getBudgetTiers('en');
export const PRIORITIES = getPriorities('en');
export const TIMELINE_OPTIONS = getTimelineOptions('en');
export const ATELIER_LOCATIONS = getAtelierLocations('en');
export const FIT_PREFERENCES = getFitPreferences('en');

