import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, X, Image as ImageIcon, Link2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { staggerContainer, microFadeUp, microFadeUpSubtle } from '../utils/motion';

// Carousel-only copies — edits here never affect silhouette/style/occasion pages
import carouselWelcome from '../assets/images/carousel/margo_welcome_hero.png';
import carouselBridal from '../assets/images/carousel/margo_occasion_bridal.jpg';
import carouselEvening from '../assets/images/carousel/margo_occasion_evening.jpg';
import carouselSpecial from '../assets/images/carousel/margo_occasion_special.png';
import carouselCustom from '../assets/images/carousel/margo_occasion_custom.jpg';
import carouselColumn from '../assets/images/carousel/margo_silhouette_column.png';
import carouselSlipBlack from '../assets/images/carousel/margo_silhouette_slip_black.jpg';
import carouselFabric from '../assets/images/carousel/margo_fabric_sage_drape.png';
import carouselBlueBlazer from '../assets/images/carousel/margo_carousel_blue_blazer.jpg';
import carouselBurgundySea from '../assets/images/carousel/margo_carousel_burgundy_sea.png';
import carouselSandBride from '../assets/images/carousel/margo_carousel_sand_bride.png';
import carouselOrangeTerrace from '../assets/images/carousel/margo_carousel_orange_terrace.png';
import carouselPinkDawn from '../assets/images/carousel/margo_carousel_pink_dawn.png';
import carouselCreamTerrace from '../assets/images/carousel/margo_carousel_cream_terrace.png';

interface StepReferencesProps {
  references: string[];
  referenceNotes: string;
  onUpdate: (data: { references: string[]; referenceNotes: string }) => void;
  onNext: () => void;
  lang: SupportedLanguage;
}

interface GalleryItem {
  id: string;
  image: string;
}

const CAROUSEL_IMAGES: GalleryItem[] = [
  { id: 'welcome', image: carouselWelcome },
  { id: 'bridal', image: carouselBridal },
  { id: 'evening', image: carouselEvening },
  { id: 'special', image: carouselSpecial },
  { id: 'custom', image: carouselCustom },
  { id: 'column', image: carouselColumn },
  { id: 'slip', image: carouselSlipBlack },
  { id: 'fabric', image: carouselFabric },
  { id: 'blue_blazer', image: carouselBlueBlazer },
  { id: 'burgundy_sea', image: carouselBurgundySea },
  { id: 'sand_bride', image: carouselSandBride },
  { id: 'orange_terrace', image: carouselOrangeTerrace },
  { id: 'pink_dawn', image: carouselPinkDawn },
  { id: 'cream_terrace', image: carouselCreamTerrace },
];

export const StepReferences: React.FC<StepReferencesProps> = ({
  references,
  referenceNotes,
  onUpdate,
  onNext,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [gallerySelected, setGallerySelected] = useState<Record<string, string>>({});

  const galleryItems = useMemo(() => CAROUSEL_IMAGES, []);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const availableSlots = 3 - references.length;
    if (availableSlots <= 0) {
      setUploadError(t.step08GalleryMax);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/') || !['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
        setUploadError('Please select image files only (JPG, PNG, WebP).');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setUploadError('File size exceeds 8MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result && !references.includes(result)) {
          const next = [...references, result].slice(0, 3);
          onUpdate({ references: next, referenceNotes });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReference = (index: number) => {
    const removed = references[index];
    const next = references.filter((_, i) => i !== index);
    setGallerySelected((prev) => {
      const updated = { ...prev };
      Object.entries(updated).forEach(([id, dataUrl]) => {
        if (dataUrl === removed) delete updated[id];
      });
      return updated;
    });
    onUpdate({ references: next, referenceNotes });
  };

  const toDataUrl = async (src: string): Promise<string> => {
    if (src.startsWith('data:')) return src;
    const res = await fetch(src);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(blob);
    });
  };

  const toggleGalleryImage = async (item: GalleryItem) => {
    setUploadError(null);
    const existing = gallerySelected[item.id];
    if (existing) {
      setGallerySelected((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      onUpdate({
        references: references.filter((r) => r !== existing),
        referenceNotes,
      });
      return;
    }
    if (references.length >= 3) {
      setUploadError(t.step08GalleryMax);
      return;
    }
    try {
      const dataUrl = await toDataUrl(item.image);
      setGallerySelected((prev) => ({ ...prev, [item.id]: dataUrl }));
      onUpdate({ references: [...references, dataUrl], referenceNotes });
    } catch {
      setUploadError('Could not add the image.');
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = Math.min(280, el.clientWidth * 0.75);
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <motion.div
      variants={staggerContainer(0.05, 0.03)}
      initial="initial"
      animate="animate"
      className="w-full max-w-xl mx-auto px-3 sm:px-4 pt-2 sm:pt-4 pb-28 flex flex-col min-w-0"
    >
      <motion.div variants={microFadeUp} className="text-center mb-5 sm:mb-6 px-0.5">
        <span className="text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#968A7F] block mb-1">
          {t.step08Badge}
        </span>
        <h2 className="font-serif text-[1.35rem] sm:text-4xl font-light text-[#1A1816] tracking-tight leading-snug break-words">
          {t.step08Title} <span className="italic font-normal">{t.step08TitleItalic}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#706459] mt-2 font-light leading-relaxed max-w-md mx-auto break-words">
          {t.step08Subtitle}
        </p>
      </motion.div>

      <motion.div variants={microFadeUp} className="mb-5">
        <input
          ref={fileInputRef}
          id="reference-file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#1A1816] bg-[#F4EFE9]'
              : 'border-[#D9D1C5] hover:border-[#A89886] bg-[#FAF8F5]'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#F2ECE3] mx-auto flex items-center justify-center text-[#6B5E53] mb-3">
            <Upload className="w-5 h-5" />
          </div>
          <div className="font-serif text-base text-[#1A1816] font-light">
            {t.step08UploadTitle(references.length)}
          </div>
          <p className="text-xs text-[#7A6E63] mt-1 font-light">{t.step08UploadSubtitle}</p>
          <span className="inline-block mt-2 text-[10px] uppercase tracking-widest text-[#988D82] px-2.5 py-0.5 rounded-full bg-[#EDE6DC]">
            {t.step08UploadLimits}
          </span>
        </div>

        {uploadError && (
          <p className="text-xs text-[#A83D3D] mt-2 text-center font-light">{uploadError}</p>
        )}
      </motion.div>

      {references.length > 0 && (
        <motion.div variants={microFadeUp} className="mb-5">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#61564C] mb-2.5 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#8C7D70]" />
            {t.clientReferencesTitle(references.length)}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {references.map((imgUrl, i) => (
              <div
                key={`${imgUrl.slice(0, 48)}-${i}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-[#D9D1C5] bg-[#ECE5DA] shadow-sm"
              >
                <img
                  src={imgUrl}
                  alt={`Reference ${i + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain object-center"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeReference(i);
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#1A1816]/80 text-[#FAF8F5] flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                  aria-label="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-white font-mono">
                  Ref 0{i + 1}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={microFadeUp} className="mb-5">
        <div className="flex items-end justify-between gap-3 mb-2 px-0.5">
          <div className="min-w-0">
            <span className="block text-xs font-medium uppercase tracking-[0.15em] text-[#544B43]">
              {t.step08CuratedLabel}
            </span>
            <p className="text-[10px] sm:text-[11px] text-[#8A7D71] font-light mt-0.5">
              {t.step08GalleryHint}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => scrollCarousel('left')}
              className="w-8 h-8 rounded-full border border-[#D9D1C5] bg-[#FAF8F5] text-[#5A4F45] flex items-center justify-center hover:border-[#A89886] transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel('right')}
              className="w-8 h-8 rounded-full border border-[#D9D1C5] bg-[#FAF8F5] text-[#5A4F45] flex items-center justify-center hover:border-[#A89886] transition-colors cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-0.5 px-0.5"
          style={{ scrollbarWidth: 'none' }}
        >
          {galleryItems.map((item) => {
            const isSelected = Boolean(gallerySelected[item.id]);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleGalleryImage(item)}
                className={`relative shrink-0 w-[42%] sm:w-[38%] snap-start rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 bg-[#F3EEE6] ${
                  isSelected
                    ? 'border-[#1A1816] ring-1 ring-[#1A1816] shadow-md'
                    : 'border-[#E8E1D6] hover:border-[#BDB0A2] shadow-sm'
                }`}
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src={item.image}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-contain object-center"
                  />
                  <div
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-[#1A1816] border-[#1A1816] text-[#FAF8F5]'
                        : 'bg-[#FAF8F5]/90 border-[#D9D1C5] text-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={microFadeUp} className="mb-6">
        <label
          htmlFor="ref-notes-input"
          className="block text-xs font-medium uppercase tracking-[0.15em] text-[#544B43] mb-1.5 flex items-center gap-1.5"
        >
          <Link2 className="w-3.5 h-3.5 text-[#8C7D70]" />
          {t.step08LinkNotesLabel}
        </label>
        <textarea
          id="ref-notes-input"
          rows={2}
          placeholder={t.step08LinkNotesPlaceholder}
          value={referenceNotes}
          onChange={(e) => onUpdate({ references, referenceNotes: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D9D1C5] text-xs sm:text-sm text-[#1A1816] focus:outline-none focus:ring-1 focus:ring-[#1A1816] resize-none"
        />
      </motion.div>

      <motion.div variants={microFadeUpSubtle} className="sticky bottom-4 z-20 w-full pt-2">
        <button
          id="references-continue-btn"
          type="button"
          onClick={onNext}
          className="w-full py-3.5 px-4 sm:px-6 rounded-full text-[10px] sm:text-sm font-medium tracking-[0.14em] sm:tracking-[0.2em] uppercase transition-all duration-200 shadow-md bg-[#1A1816] text-[#FAF8F5] hover:bg-[#2C2723] active:scale-[0.99] cursor-pointer"
        >
          {t.step08Continue}
        </button>
      </motion.div>
    </motion.div>
  );
};
