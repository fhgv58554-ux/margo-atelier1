import { SupportedLanguage } from './translations';
import { getOccasions, getSilhouettes, getStyles } from './atelierContent';
import lookBurgundy from '../assets/images/tryon/look-burgundy.png';
import lookOrange from '../assets/images/tryon/look-orange.png';
import lookPink from '../assets/images/tryon/look-pink.png';
import lookResult from '../assets/images/tryon/look-result.jpg';

export type AtelierLookItem = {
  id: string;
  src: string;
  label: string;
};

const carouselModules = import.meta.glob('../assets/images/carousel/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

/** Looks removed from Virtual Try-On catalogue (kept elsewhere in the app). */
const EXCLUDED_IDS = new Set([
  'tryon-dress',
  'sil-coat_dress',
  'sil-slip_bias',
  'sil-aline',
  'sil-mermaid',
  'style-sculptural_avantgarde',
  'style-contemporary_romantic',
  'style-sensual_siren',
  'style-quiet_luxury',
  'occ-special_occasion',
]);

const EXCLUDED_FILENAME_PARTS = [
  'look-dress',
  'margo_silhouette_coatdress',
  'margo_silhouette_slip',
  'margo_silhouette_aline',
  'margo_silhouette_mermaid',
  'margo_style_sculptural',
  'margo_style_contemporary_romantic',
  'margo_style_sensual_siren',
  'margo_style_quiet_luxury',
  'margo_bridal_editorial_1789726696806',
  'margo_custom_dress_1789726740808',
  'margo_special_occasion_1789726725864',
  'margo_occasion_special',
];

function isExcluded(id: string, src: string): boolean {
  if (EXCLUDED_IDS.has(id)) return true;
  const path = src.toLowerCase();
  return EXCLUDED_FILENAME_PARTS.some((part) => path.includes(part.toLowerCase()));
}

function labelFromFilename(filename: string, _lang: SupportedLanguage): string {
  const base = filename
    .replace(/\.[^.]+$/, '')
    .replace(/^margo[_-]?/i, '')
    .replace(/_\d{10,}$/g, '')
    .replace(/[_-]+/g, ' ')
    .trim();

  return base
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function pushUnique(list: AtelierLookItem[], item: AtelierLookItem) {
  if (!item.src) return;
  if (isExcluded(item.id, item.src)) return;
  if (list.some((x) => x.src === item.src || x.id === item.id)) return;
  list.push(item);
}

/** Full atelier catalogue for Virtual Try-On selection. */
export function getAtelierCatalogueLooks(lang: SupportedLanguage): AtelierLookItem[] {
  const looks: AtelierLookItem[] = [];

  pushUnique(looks, {
    id: 'tryon-burgundy',
    src: lookBurgundy,
    label: 'Burgundy',
  });
  pushUnique(looks, {
    id: 'tryon-orange',
    src: lookOrange,
    label: 'Orange',
  });
  pushUnique(looks, {
    id: 'tryon-pink',
    src: lookPink,
    label: 'Pink',
  });
  pushUnique(looks, {
    id: 'tryon-result',
    src: lookResult,
    label: 'Try-on result',
  });

  for (const item of getOccasions(lang)) {
    if (!item.image) continue;
    pushUnique(looks, {
      id: `occ-${item.id}`,
      src: item.image,
      label: item.title,
    });
  }

  for (const item of getSilhouettes(lang)) {
    if (!item.image) continue;
    pushUnique(looks, {
      id: `sil-${item.id}`,
      src: item.image,
      label: item.name,
    });
  }

  for (const item of getStyles(lang)) {
    if (!item.image) continue;
    pushUnique(looks, {
      id: `style-${item.id}`,
      src: item.image,
      label: item.name,
    });
  }

  for (const [path, src] of Object.entries(carouselModules)) {
    const filename = path.split('/').pop() || path;
    pushUnique(looks, {
      id: `carousel-${filename}`,
      src,
      label: labelFromFilename(filename, lang),
    });
  }

  return looks;
}
