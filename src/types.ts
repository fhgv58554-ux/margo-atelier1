export type OccasionType = 'bridal' | 'evening' | 'special_occasion' | 'custom_dress';

export interface OccasionOption {
  id: OccasionType;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
}

export interface SilhouetteOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image?: string;
  characteristics: string[];
}

export interface StyleOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image?: string;
  moodWords: string[];
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  secondaryHex?: string;
  description: string;
  paletteMood: string;
}

export interface BudgetOption {
  id: string;
  range: string;
  tier: string;
  prices: string[];
  description: string;
  includes: string[];
  note: string;
}

export interface PriorityOption {
  id: string;
  label: string;
  description: string;
}

export interface ClientMeasurements {
  height: string;
  clothingSize: string;
  fitPreferences: string[];
  notes: string;
}

export interface ClientContact {
  fullName: string;
  telegramHandle: string;
  whatsappPhone: string;
  consultationType: 'atelier' | 'virtual';
  atelierLocation: string;
  preferredLanguage: string;
}

export interface AIStyleDirection {
  headline: string;
  concept: string;
  recommendedFabrics: string[];
  architecturalDetails: string[];
  consultationFocus: string[];
}

export interface ConsultationDossier {
  id?: string;
  createdAt?: string;
  occasion: OccasionType | '';
  date: string;
  timeline: string;
  settings: string[];
  settingOther: string;
  eventCity: string;
  budget: string;
  silhouette: string[];
  style: string[];
  colors: string[];
  customColorNote: string;
  measurements: ClientMeasurements;
  references: string[];
  referenceNotes: string;
  priorities: string[];
  contact: ClientContact;
  aiStyleDirection?: AIStyleDirection;
  consentAccepted?: boolean;
  consentAcceptedAt?: string;
  consentVersion?: string;
  status?: 'new' | 'contacted' | 'scheduled' | 'fitting' | 'completed';
  archived?: boolean;
  archivedAt?: string;
}

export type StepKey =
  | 'welcome'
  | 'explore_intro'
  | 'book_consultation'
  | 'virtual_tryon'
  | 'occasion'
  | 'date'
  | 'budget'
  | 'silhouette'
  | 'style'
  | 'colours'
  | 'measurements'
  | 'references'
  | 'priorities'
  | 'contacts'
  | 'summary';
