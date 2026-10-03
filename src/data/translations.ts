export type SupportedLanguage = 'ru' | 'en';

export interface TranslationDict {
  brandName: string;
  brandTagline: string;
  badge: string;
  appTitle: string;
  appIntro: string[];
  stats: {
    time: { title: string; desc: string };
    ai: { title: string; desc: string };
    privacy: { title: string; desc: string };
  };
  startBtn: string;
  bookConsultationBtn: string;
  bookConsultationHint: string;
  startBtnHint: string;
  virtualTryOnBtn: string;
  virtualTryOnHint: string;
  virtualTryOnPromo: string;
  exploreIntroBadge: string;
  exploreIntroTitle: string;
  exploreIntroTitleItalic: string;
  exploreIntroBody: string[];
  exploreIntroNext: string;
  bookBadge: string;
  bookTitle: string;
  bookTitleItalic: string;
  bookSubtitle: string;
  bookNameLabel: string;
  bookNamePlaceholder: string;
  bookWaLabel: string;
  bookWaPlaceholder: string;
  bookSubmitBtn: string;
  bookSubmitting: string;
  bookSuccessTitle: string;
  bookSuccessText: (id: string) => string;
  bookError: string;
  bookBackHome: string;
  tryonBadge: string;
  tryonTitle: string;
  tryonTitleItalic: string;
  tryonIntro: string[];
  tryonOriginalLabel: string;
  tryonResultLabel: string;
  tryonDressLabel: string;
  tryonExamplesLabel: string;
  tryonVideoLabel: string;
  tryonPriceNote: string;
  tryonPricingTitle: string;
  tryonPackageOneTitle: string;
  tryonPackageOneBody: string;
  tryonPackageThreeTitle: string;
  tryonPackageThreeBody: string;
  tryonHowTitle: string;
  tryonHowSteps: string[];
  tryonPricingNotes: string[];
  tryonTariffTitle: string;
  tryonTariffSubtitle: string;
  tryonTariffOneTitle: string;
  tryonTariffOnePrice: string;
  tryonTariffOneDesc: string;
  tryonTariffThreeTitle: string;
  tryonTariffThreePrice: string;
  tryonTariffThreeDesc: string;
  tryonTariffBack: string;
  tryonPayTitle: string;
  tryonPaySubtitle: (amount: string) => string;
  tryonSaAgreement: string;
  tryonPayBtn: string;
  tryonPayBack: string;
  tryonPayLoading: string;
  tryonPayNotConfigured: string;
  tryonPayError: string;
  tryonNameLabel: string;
  tryonNamePlaceholder: string;
  tryonWaLabel: string;
  tryonWaPlaceholder: string;
  tryonNoteLabel: string;
  tryonNotePlaceholder: string;
  tryonUploadTitle: string;
  tryonUploadHint: string;
  tryonUploadLimits: string;
  tryonUploadMax: string;
  tryonUploadRequired: string;
  tryonAtelierTitle: string;
  tryonAtelierHint: string;
  tryonAtelierBtn: string;
  tryonAtelierMax: string;
  tryonAtelierRequired: string;
  tryonAtelierSelected: string;
  tryonOrderNumberLabel: string;
  tryonSubmitBtn: string;
  tryonWhatsappHelp: string;
  tryonSubmitting: string;
  tryonSuccessTitle: string;
  tryonSuccessText: (id: string) => string;
  tryonError: string;
  tryonBackHome: string;
  citiesFooter: string;
  citiesFooterSub: string;
  headerWhatsappLabel: string;
  headerWhatsappNumber: string;
  consentTitle: string;
  consentIntro: string;
  consentTermsTitle: string;
  consentTermsBody: string[];
  consentPrivacyTitle: string;
  consentPrivacyBody: string[];
  consentTermsCheck: string;
  consentPrivacyCheck: string;
  consentAcceptBtn: string;
  consentCancelBtn: string;
  adminLoginTitle: string;
  adminLoginHint: string;
  adminLoginStaffNote: string;
  adminPasswordLabel: string;
  adminPasswordPlaceholder: string;
  adminLoginBtn: string;
  adminLoginError: string;
  adminLoginErrorUnauthorized: string;
  adminLoginErrorNotConfigured: string;
  adminLoginErrorOffline: string;
  adminSessionExpired: string;
  adminLogoutBtn: string;

  // Header
  atelierDeskBtn: string;
  clientAppBtn: string;
  stepIndicator: (current: number, total: number) => string;
  headerSub: string;

  // Step Occasion
  step01Badge: string;
  step01Title: string;
  step01TitleItalic: string;
  step01Subtitle: string;
  step01PhotoNote: string;
  step01Continue: string;
  step01SelectHint: string;

  // Step Date
  step02Badge: string;
  step02Title: string;
  step02TitleItalic: string;
  step02Subtitle: string;
  step02DateLabel: string;
  step02DatePlaceholder: string;
  step02TimelineLabel: string;
  step02TimelineNote: string;
  step02TimelineAutoHint: string;
  step02SettingLabel: string;
  step02SettingHint: string;
  step02OtherLabel: string;
  step02OtherPlaceholder: string;
  step02CityLabel: string;
  step02CityPlaceholder: string;
  step02Continue: string;
  step02PageFooterBrand: string;
  step02PageFooterPlace: string;
  step02PageFooterMode: string;

  // Step Budget
  step03Badge: string;
  step03Title: string;
  step03TitleItalic: string;
  step03Subtitle: string;
  step03Disclaimer: string;
  step03IncludedBadge: string;
  step03Continue: string;
  step03SelectHint: string;
  step03PageFooterBrand: string;
  step03PageFooterPlace: string;
  step03PageFooterMode: string;

  // Step Silhouette
  step04Badge: string;
  step04Title: string;
  step04TitleItalic: string;
  step04Subtitle: string;
  step04Note: string;
  step04Continue: string;
  step04SelectHint: string;
  step04PageFooterBrand: string;
  step04PageFooterPlace: string;
  step04PageFooterMode: string;
  step04PageFooterTag: string;

  // Step Style
  step05Badge: string;
  step05Title: string;
  step05TitleItalic: string;
  step05Subtitle: string;
  step05Continue: string;
  step05SelectHint: string;
  step05PageFooterBrand: string;
  step05PageFooterPlace: string;
  step05PageFooterMode: string;

  // Step Colours
  step06Badge: string;
  step06Title: string;
  step06TitleItalic: string;
  step06Subtitle: string;
  step06CustomLabel: string;
  step06CustomOptional: string;
  step06CustomPlaceholder: string;
  step06Disclaimer: string;
  step06Continue: string;
  step06SelectHint: string;
  step06PageFooterBrand: string;
  step06PageFooterPlace: string;
  step06PageFooterMode: string;

  // Step Measurements
  step07Badge: string;
  step07Title: string;
  step07TitleItalic: string;
  step07Subtitle: string;
  step07HeightLabel: string;
  step07HeightOptional: string;
  step07HeightPlaceholder: string;
  step07SizeLabel: string;
  step07SizeOptional: string;
  step07SizePlaceholder: string;
  step07SizeDefault: string;
  step07SizeDontKnow: string;
  step07SizeHint: string;
  step07FitLabel: string;
  step07FitHint: string;
  step07NotesLabel: string;
  step07NotesOptional: string;
  step07NotesPlaceholder: string;
  step07Continue: string;
  step07PageFooterBrand: string;
  step07PageFooterPlace: string;
  step07PageFooterMode: string;

  // Step References
  step08Badge: string;
  step08Title: string;
  step08TitleItalic: string;
  step08Subtitle: string;
  step08UploadTitle: (count: number) => string;
  step08UploadSubtitle: string;
  step08UploadLimits: string;
  step08CuratedLabel: string;
  step08GalleryHint: string;
  step08GalleryMax: string;
  step08LinkNotesLabel: string;
  step08LinkNotesPlaceholder: string;
  step08Continue: string;

  // Step Priorities
  step09Badge: string;
  step09Title: string;
  step09TitleItalic: string;
  step09Subtitle: string;
  step09Continue: (count: number) => string;

  // Step Contacts
  step10Badge: string;
  step10Title: string;
  step10TitleItalic: string;
  step10Subtitle: string;
  step10NameLabel: string;
  step10NamePlaceholder: string;
  step10TgLabel: string;
  step10TgHint: string;
  step10WaLabel: string;
  step10VenueLabel: string;
  step10LangLabel: string;
  step10GenerateBtn: string;

  // Summary (Proposal / Досье)
  summaryRef: string;
  summaryTitle: string;
  summaryTitleItalic: string;
  summaryPreparedFor: (name: string, location: string) => string;
  summaryTransmittedBannerTitle: string;
  summaryTransmittedBannerText: string;
  aestheticDirection: string;
  specTimeline: string;
  specProportions: string;
  specFit: string;
  specVenue: string;
  selectedPalette: string;
  clientPriorities: string;
  clientReferencesTitle: (count: number) => string;

  // AI Style Direction Card
  aiGeminiBadge: string;
  aiDirectionTitle: string;
  aiRegenerate: string;
  aiLoadingTitle: string;
  aiLoadingSub: string;
  aiAestheticVision: string;
  aiRecommendedFabrics: string;
  aiArchitecturalDetails: string;
  aiConsultationFocus: string;

  // CTAs in Proposal
  sendDossierChoice: string;
  btnBookWhatsapp: string;
  btnSendTelegram: string;
  btnSendDossier: string;
  btnDownloadDossier: string;
  btnDownloadingDossier: string;
  dossierVisualHeading: string;
  dossierVisualSaved: string;
  dossierVisualTitle: string;
  dossierVisualClient: string;
  dossierVisualPriorities: string;
  dossierVisualPhotos: string;
  dossierFieldName: string;
  dossierFieldLocation: string;
  dossierFieldOccasion: string;
  dossierFieldDate: string;
  dossierFieldBudget: string;
  dossierFieldSilhouette: string;
  dossierFieldStyle: string;
  dossierFieldColours: string;
  dossierFieldFit: string;
  dossierFieldSize: string;
  dossierFieldHeight: string;
  btnSending: string;
  btnSent: string;
  thankYouOrderLabel: string;
  thankYouMessage: string;
  thankYouClose: string;
  btnShare: string;
  btnCopied: string;
  btnDashboard: string;
  btnRestart: string;

  // Dashboard
  dashConsoleBadge: string;
  dashTitle: string;
  dashBackBtn: string;
  dashTotal: string;
  dashNew: string;
  dashScheduled: string;
  dashTgSync: string;
  dashConnected: string;
  dashSearchPlaceholder: string;
  dashNoDossiers: string;
  dashNoDossiersSub: string;
  dashFilterAll: string;
  dashFilterNew: string;
  dashFilterScheduled: string;
  dashFilterFitting: string;
  dashFilterArchive: string;
  dashArchiveBtn: string;
  dashArchiveTitle: string;
  dashArchiveText: string;
  dashArchiveConfirm: string;
  dashPurgeBtn: string;
  dashPurgeTitle: string;
  dashPurgeText: string;
  dashPurgePassword: string;
  dashPurgeConfirm: string;
  dashCancel: string;
  dashActionError: string;
  statusNew: string;
  statusContacted: string;
  statusScheduled: string;
  statusFitting: string;
  statusCompleted: string;

  // Footer
  footerSlogan: string;
  footerWords: string[];
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDict> = {
  ru: {
    brandName: 'MARGO Bridal & Special Occasion',
    brandTagline: 'Made-to-order bridal & evening wear',
    badge: 'Подбор образа',
    appTitle: 'Ваш образ для особенного события',
    appIntro: [
      'Свадебные и вечерние платья, красивые ткани и аксессуары — в MARGO Bridal & Special Occasion в Onrus, Western Cape, South Africa.',
      'Этот короткий опрос поможет вам определиться с пожеланиями, а нам — подготовиться к вашей первой встрече.',
    ],
    stats: {
      time: { title: 'Короткий опрос', desc: 'Ваше событие и пожелания' },
      ai: { title: 'Ваш стиль', desc: 'Силуэты, ткани и детали' },
      privacy: { title: 'Личная встреча', desc: 'В ателье или онлайн' },
    },
    startBtn: 'Explore Your Look',
    bookConsultationBtn: 'Book a Consultation',
    bookConsultationHint: 'Короткая форма анкеты для записи на консультацию',
    startBtnHint: 'Выбирайте силуэты, цвета и детали, которые вам нравятся',
    virtualTryOnBtn: 'Order a Virtual Try-On',
    virtualTryOnHint: 'Увидеть выбранный образ на своём фото — отдельная платная услуга',
    virtualTryOnPromo:
      'У Вас есть уникальная возможность увидеть выбранную модель платья на себе до его пошива. Данная услуга оплачивается отдельно.',
    exploreIntroBadge: 'Подбор образа',
    exploreIntroTitle: 'Как проходит',
    exploreIntroTitleItalic: 'подбор',
    exploreIntroBody: [
      'Расскажите о событии и выберите образы, которые вам нравятся. На консультации мы обсудим подходящие силуэты, ткани и детали — для выбора готового платья или заказа по выбранной модели.',
      'Встречи в ателье — по предварительной записи. Онлайн-консультации также доступны.',
    ],
    exploreIntroNext: 'Далее',
    bookBadge: 'Быстрая заявка',
    bookTitle: 'Запись на',
    bookTitleItalic: 'консультацию',
    bookSubtitle: 'Короткая форма — без полного подбора образа. Мы свяжемся с вами в WhatsApp.',
    bookNameLabel: 'Имя',
    bookNamePlaceholder: 'Как к вам обращаться',
    bookWaLabel: 'WhatsApp',
    bookWaPlaceholder: '+27 / +7 / +39…',
    bookSubmitBtn: 'Оставить заявку',
    bookSubmitting: 'Отправка…',
    bookSuccessTitle: 'Заявка отправлена',
    bookSuccessText: (id) => `Номер заявки ${id}. Координатор ателье напишет вам в WhatsApp.`,
    bookError: 'Не удалось отправить. Проверьте данные и попробуйте снова.',
    bookBackHome: 'На главную',
    tryonBadge: 'Платная услуга',
    tryonTitle: 'Virtual',
    tryonTitleItalic: 'Try-On',
    tryonIntro: [
      'Посмотрите выбранный образ на своей фотографии',
      'Представьте, как выбранная модель платья или цвет могут выглядеть на вас, прежде чем оформлять заказ. Каждое изображение создаётся и проверяется лично дизайнером MARGO.',
    ],
    tryonOriginalLabel: 'Ваше фото',
    tryonResultLabel: 'Результат примерки',
    tryonDressLabel: 'Модель платья',
    tryonExamplesLabel: 'Пример результата',
    tryonVideoLabel: 'Видео примерки',
    tryonPriceNote: 'Услуга оплачивается отдельно. Детали и стоимость подтвердим в WhatsApp.',
    tryonPricingTitle: 'Стоимость услуги',
    tryonPackageOneTitle: 'Один образ — R350',
    tryonPackageOneBody:
      'Одно выбранное платье на вашей фотографии. Включает одно итоговое изображение и одну небольшую корректировку.',
    tryonPackageThreeTitle: 'Три образа — R750',
    tryonPackageThreeBody:
      'Сравните три модели платья или варианта цвета на одной фотографии. Включает три итоговых изображения и один раунд небольших корректировок.',
    tryonHowTitle: 'Как это работает',
    tryonHowSteps: [
      'Загрузите чёткую фотографию в полный рост.',
      'Выберите один или три образа.',
      'Оплатите услугу.',
      'Получите изображения в течение двух рабочих дней после получения оплаты, подходящей фотографии и выбранных образов.',
    ],
    tryonPricingNotes: [
      'Небольшие корректировки включают изменение цвета или длины рукава. Другая модель платья считается новым образом.',
      'Услуга доступна отдельно — заказывать платье необязательно. Если вы закажете платье в MARGO, стоимость виртуальной примерки будет зачтена в его стоимость.',
      'Виртуальная примерка помогает представить образ. Точная посадка, ткань и конструкция уточняются на консультации и примерках в процессе пошива. Все платья изготавливаются только на заказ.',
    ],
    tryonTariffTitle: 'Выберите тариф',
    tryonTariffSubtitle: 'Оплата через PayPal · валюта ZAR (ЮАР)',
    tryonTariffOneTitle: 'Один образ',
    tryonTariffOnePrice: 'R350',
    tryonTariffOneDesc: 'Одно платье на вашей фотографии · одно итоговое изображение · одна небольшая корректировка',
    tryonTariffThreeTitle: 'Три образа',
    tryonTariffThreePrice: 'R750',
    tryonTariffThreeDesc: 'Три модели или цвета на одной фотографии · три итоговых изображения · один раунд корректировок',
    tryonTariffBack: 'Назад к заявке',
    tryonPayTitle: 'Оплата PayPal',
    tryonPaySubtitle: (amount) => `Сумма заказа: ${amount} ZAR`,
    tryonSaAgreement:
      'Я подтверждаю договор на оказание услуг виртуальной примерки в соответствии с законодательством Южно-Африканской Республики (ЮАР), включая Consumer Protection Act 68 of 2008, и соглашаюсь с условиями и стоимостью выбранного тарифа.',
    tryonPayBtn: 'Оплатить',
    tryonPayBack: 'К выбору тарифа',
    tryonPayLoading: 'Загрузка PayPal…',
    tryonPayNotConfigured:
      'PayPal ещё не подключён. Добавьте PAYPAL_CLIENT_ID и PAYPAL_CLIENT_SECRET в настройки сервера.',
    tryonPayError: 'Не удалось провести оплату. Попробуйте ещё раз.',
    tryonNameLabel: 'Имя',
    tryonNamePlaceholder: 'Как к вам обращаться',
    tryonWaLabel: 'WhatsApp',
    tryonWaPlaceholder: '+27 / +7 / +39…',
    tryonNoteLabel: 'Пожелания',
    tryonNotePlaceholder: 'Повод, стиль платья, ссылки на референсы…',
    tryonUploadTitle: 'Ваши фото',
    tryonUploadHint: 'Загрузите до 4 личных фото для примерки',
    tryonUploadLimits: 'JPG, PNG или WebP · до 8 МБ каждое · максимум 4',
    tryonUploadMax: 'Можно загрузить не более 4 фото',
    tryonUploadRequired: 'Добавьте хотя бы одно личное фото',
    tryonAtelierTitle: 'Образы ателье',
    tryonAtelierHint: 'Выберите один или несколько образов из коллекции MARGO для виртуальной примерки',
    tryonAtelierBtn: 'Добавить образ из нашего ателье',
    tryonAtelierMax: 'Можно выбрать не более 3 образов ателье',
    tryonAtelierRequired: 'Выберите хотя бы один образ из ателье',
    tryonAtelierSelected: 'Выбранные образы',
    tryonOrderNumberLabel: 'Номер заказа',
    tryonSubmitBtn: 'Заказать',
    tryonWhatsappHelp: 'Если у Вас остались вопросы, Вы можете обратиться к нам по WhatsApp',
    tryonSubmitting: 'Отправка…',
    tryonSuccessTitle: 'Заявка принята',
    tryonSuccessText: (id) => `Номер заказа ${id}. Мы свяжемся в WhatsApp, чтобы уточнить фото и образы.`,
    tryonError: 'Не удалось отправить. Попробуйте ещё раз.',
    tryonBackHome: 'На главную',
    citiesFooter: 'By appointment in Onrus · Online consultations available',
    citiesFooterSub: '',
    headerWhatsappLabel: 'Консультация WhatsApp',
    headerWhatsappNumber: '+27 76 364 3600',
    consentTitle: 'Согласие пользователя',
    consentIntro:
      'Перед началом подбора образа подтвердите согласие с условиями использования и обработкой персональных данных.',
    consentTermsTitle: 'Пользовательское соглашение',
    consentTermsBody: [
      'Сервис MARGO Bridal & Special Occasion помогает подготовить пожелания к консультации по свадебным и вечерним платьям.',
      'Ответы анкеты используются только для подготовки к встрече в ателье или онлайн и не являются публичным предложением.',
      'Окончательный выбор модели, ткани, стоимости и сроков подтверждается на консультации.',
    ],
    consentPrivacyTitle: 'Обработка персональных данных',
    consentPrivacyBody: [
      'Вы даёте согласие на обработку указанных вами данных: имя, контакты, параметры посадки, пожелания по образу и загруженные изображения.',
      'Данные хранятся для связи по консультации и передачи в рабочий контур ателье (включая уведомление в Telegram).',
      'Вы можете запросить уточнение или удаление данных, связавшись с ателье по указанным контактам.',
    ],
    consentTermsCheck: 'Я принимаю пользовательское соглашение',
    consentPrivacyCheck: 'Я соглашаюсь на обработку персональных данных',
    consentAcceptBtn: 'Принять и продолжить',
    consentCancelBtn: 'Отмена',
    adminLoginTitle: 'Вход в консоль ателье',
    adminLoginHint: 'Это раздел только для сотрудников. Пароль нужен, чтобы смотреть анкеты клиентов.',
    adminLoginStaffNote: 'Чтобы пройти опрос как клиент, пароль не нужен — нажмите «К анкете» ниже.',
    adminPasswordLabel: 'Пароль',
    adminPasswordPlaceholder: 'Пароль доступа',
    adminLoginBtn: 'Войти',
    adminLoginError: 'Не удалось войти. Попробуйте ещё раз.',
    adminLoginErrorUnauthorized: 'Неверный пароль.',
    adminLoginErrorNotConfigured: 'Пароль админа не настроен. Добавьте ADMIN_PASSWORD в файл .env и перезапустите сервер.',
    adminLoginErrorOffline: 'Сервер не отвечает. Запустите приложение командой npm run dev и попробуйте снова.',
    adminSessionExpired: 'Сессия закончилась. Введите пароль ещё раз.',
    adminLogoutBtn: 'Выйти',

    atelierDeskBtn: 'Консоль Ателье',
    clientAppBtn: 'К анкете',
    stepIndicator: (current, total) => `Шаг ${String(current).padStart(2, '0')} из ${String(total).padStart(2, '0')}`,
    headerSub: 'Консультация',

    step01Badge: 'Шаг 01 · Повод и формат',
    step01Title: 'Ваш особенный',
    step01TitleItalic: 'повод',
    step01Subtitle:
      'Каждое изделие начинается с контекста атмосферы и света предстоящего события.',
    step01PhotoNote:
      'Изображения передают настроение и направление стиля. Наличие моделей и возможность изготовления уточним на консультации.',
    step01Continue: 'Далее: о вашем событии',
    step01SelectHint: 'Выберите повод',

    step02Badge: 'Шаг 02 · Ваше событие',
    step02Title: 'Когда и где состоится',
    step02TitleItalic: 'ваше событие?',
    step02Subtitle:
      'Расскажите о дате и месте проведения. Это поможет нам предложить подходящий образ и обсудить время на выбор платья, возможную подгонку или изготовление на заказ.',
    step02DateLabel: 'Дата события — если уже известна',
    step02DatePlaceholder: 'Выберите дату',
    step02TimelineLabel: 'Сколько времени осталось до события?',
    step02TimelineNote: 'Возможность заказа и сроки изготовления уточняются на консультации.',
    step02TimelineAutoHint: 'Срок рассчитан по выбранной дате',
    step02SettingLabel: 'Где и в каком формате пройдёт событие?',
    step02SettingHint: 'Выберите подходящие варианты.',
    step02OtherLabel: 'Расскажите коротко о месте или формате события.',
    step02OtherPlaceholder: 'Кратко опишите место или формат',
    step02CityLabel: 'В каком городе или регионе состоится событие?',
    step02CityPlaceholder: 'Укажите город или регион.',
    step02Continue: 'Далее: ваш бюджет и пожелания',
    step02PageFooterBrand: 'MARGO Bridal & Special Occasion',
    step02PageFooterPlace: 'Onrus, Western Cape, South Africa',
    step02PageFooterMode: 'В ателье и онлайн',

    step03Badge: 'Шаг 03 · Формат и бюджет',
    step03Title: 'Какой вариант',
    step03TitleItalic: 'вам ближе?',
    step03Subtitle:
      'Выберите направление и комфортный ориентир бюджета. Это поможет нам подготовить подходящие предложения к консультации.',
    step03Disclaimer:
      'Указанные цены являются предварительными ориентирами. Итоговая стоимость зависит от модели, ткани, конструкции и отделки и согласовывается до начала изготовления. Все цены указываются в южноафриканских рандах — ZAR / R.',
    step03IncludedBadge: 'Что входит:',
    step03Continue: 'Перейти к Выбору Силуэта',
    step03SelectHint: 'Выберите вариант',
    step03PageFooterBrand: 'MARGO Bridal & Special Occasion',
    step03PageFooterPlace: 'Onrus, Western Cape, South Africa',
    step03PageFooterMode: 'Консультации в ателье и онлайн.',

    step04Badge: 'Шаг 04 · Выбор силуэта',
    step04Title: 'Какой силуэт',
    step04TitleItalic: 'вам нравится?',
    step04Subtitle:
      'Выберите один или несколько вариантов, которые вам близки. На примерке мы поможем уточнить форму, посадку и детали с учётом ваших пожеланий.',
    step04Note:
      'Изображения помогают выбрать направление стиля. Ткань, цвет, детали и возможность изготовления обсуждаются на консультации.',
    step04Continue: 'Далее: стиль и детали',
    step04SelectHint: 'Выберите силуэт',
    step04PageFooterBrand: 'MARGO Bridal & Special Occasion',
    step04PageFooterPlace: 'Onrus, Western Cape, South Africa',
    step04PageFooterMode: 'В ателье и онлайн',
    step04PageFooterTag: 'Платья · Ткани · Аксессуары',

    step05Badge: 'Шаг 05 · Стиль и настроение',
    step05Title: 'Каким вы видите',
    step05TitleItalic: 'свой образ?',
    step05Subtitle:
      'Сдержанным, романтичным, выразительным или чувственным? Выберите одно или несколько направлений, которые вам близки. Детали мы обсудим на консультации.',
    step05Continue: 'Далее: ткани и цвета',
    step05SelectHint: 'Выберите направление',
    step05PageFooterBrand: 'MARGO Bridal & Special Occasion',
    step05PageFooterPlace: 'Onrus, Western Cape, South Africa',
    step05PageFooterMode: 'В ателье и онлайн',

    step06Badge: 'Шаг 06 · Ткани и цвета',
    step06Title: 'Палитра',
    step06TitleItalic: 'вашего образа',
    step06Subtitle:
      'Светлые свадебные оттенки, мягкие пастельные тона и глубокие вечерние цвета. Выберите до двух оттенков, которые вам близки.',
    step06CustomLabel: 'Другой оттенок или пожелания',
    step06CustomOptional: 'Необязательное поле',
    step06CustomPlaceholder:
      'Например: холодный светлый оттенок, мягкое сияние или сочетание двух цветов.',
    step06Disclaimer:
      'Цвет на экране может отличаться от реального оттенка ткани. Окончательный выбор сделаем по образцам. Наличие нужного оттенка и достаточного количества ткани подтвердим на консультации.',
    step06Continue: 'Далее: пропорции и посадка',
    step06SelectHint: 'Выберите оттенок',
    step06PageFooterBrand: 'MARGO Bridal & Special Occasion',
    step06PageFooterPlace: 'Onrus, Western Cape, South Africa',
    step06PageFooterMode: 'В ателье и онлайн',

    step07Badge: 'Шаг 07 · Посадка и комфорт',
    step07Title: 'Что важно для вас',
    step07TitleItalic: 'в посадке платья?',
    step07Subtitle:
      'Подчеркнуть талию, мягко следовать линиям фигуры или оставить больше свободы? Расскажите о своих предпочтениях — это поможет нам подобрать подходящую модель.',
    step07HeightLabel: 'Ваш рост, см',
    step07HeightOptional: 'Необязательное поле',
    step07HeightPlaceholder: 'Например: 165 — без обуви.',
    step07SizeLabel: 'Ваш обычный размер одежды',
    step07SizeOptional: 'Необязательное поле',
    step07SizePlaceholder: 'Выберите размер или «Не знаю».',
    step07SizeDefault: 'Выберите размер',
    step07SizeDontKnow: 'Не знаю',
    step07SizeHint:
      'Размер поможет нам сориентироваться. Точные мерки и посадку уточним при подготовке заказа.',
    step07FitLabel: 'Какая посадка вам ближе?',
    step07FitHint: 'Можно выбрать несколько вариантов.',
    step07NotesLabel: 'Ваши пожелания',
    step07NotesOptional: 'Необязательное поле',
    step07NotesPlaceholder:
      'Например: хочу носить обычный бюстгальтер, предпочитаю прикрытые руки, важна свобода в области живота или удобство для танцев.',
    step07Continue: 'Далее: ваши идеи и примеры',
    step07PageFooterBrand: 'MARGO Bridal & Special Occasion',
    step07PageFooterPlace: 'Onrus, Western Cape, South Africa',
    step07PageFooterMode: 'В ателье и онлайн',

    step08Badge: 'Шаг 08 · Визуальные Референсы',
    step08Title: 'Мудборд и',
    step08TitleItalic: 'вдохновение',
    step08Subtitle: 'Загрузите до 3 фотографий, эскизов или прикрепите ссылку на ваш мудборд.',
    step08UploadTitle: (count) => `Загрузить изображения (${count}/3)`,
    step08UploadSubtitle: 'Перетащите сюда или выберите из галереи устройства.',
    step08UploadLimits: 'JPG, PNG, WebP до 8 МБ',
    step08CuratedLabel: 'Или выберите образы из коллекции',
    step08GalleryHint: 'До 3 фото. Выбранные добавятся к загрузке.',
    step08GalleryMax: 'Можно выбрать не больше 3 изображений.',
    step08LinkNotesLabel: 'Ссылка на Pinterest / Instagram или заметки о стиле',
    step08LinkNotesPlaceholder: 'Вставьте ссылку на доску или опишите элементы, которые вам близки...',
    step08Continue: 'Перейти к Приоритетам',

    step09Badge: 'Шаг 09 · Творческие Приоритеты',
    step09Title: 'Что для вас',
    step09TitleItalic: 'важнее всего?',
    step09Subtitle: 'Подскажите нашему главному кутюрье главные ценности изделия. Выберите от 1 до 3 пунктов.',
    step09Continue: (count) => count > 0 ? `Продолжить (выбрано: ${count})` : 'Выберите хотя бы 1 приоритет',

    step10Badge: 'Шаг 10 · Досье Клиента',
    step10Title: 'Как к вам',
    step10TitleItalic: 'обращаться?',
    step10Subtitle: 'Ваши контакты хранятся в строжайшей конфиденциальности координатором ателье.',
    step10NameLabel: 'Ваше имя и фамилия *',
    step10NamePlaceholder: 'например, Анна Воронова',
    step10TgLabel: 'Никнейм в Telegram (@username)',
    step10TgHint: 'Координатор ателье свяжется с вами напрямую в Telegram с деталями предложения.',
    step10WaLabel: 'Номер телефона в WhatsApp',
    step10VenueLabel: 'Желаемый формат / салон консультации',
    step10LangLabel: 'Язык консультации',
    step10GenerateBtn: 'Сформировать Предложение и AI Style Direction',

    summaryRef: 'Досье Ателье №',
    summaryTitle: 'Ваше Консультационное',
    summaryTitleItalic: 'Предложение',
    summaryPreparedFor: (name, loc) => `Подготовлено для: ${name || 'Клиент'} · ${loc}`,
    summaryTransmittedBannerTitle: 'Досье отправлено',
    summaryTransmittedBannerText: 'Благодарим за обращение в MARGO Bridal & Special Occasion. В ближайшее время с Вами свяжется наш администратор.',
    aestheticDirection: 'Эстетическое Направление',
    specTimeline: 'Сроки',
    specProportions: 'Размер',
    specFit: 'Посадка',
    specVenue: 'Салон',
    selectedPalette: 'Выбранная палитра',
    clientPriorities: 'Приоритеты клиента',
    clientReferencesTitle: (count) => `Ваши загруженные референсы (${count})`,

    aiGeminiBadge: 'Интеллект Gemini',
    aiDirectionTitle: 'AI Style Direction · Стилистическая Концепция',
    aiRegenerate: 'Обновить',
    aiLoadingTitle: 'Синтез индивидуальной кутюрной концепции...',
    aiLoadingSub: 'Подбор шелков из Комо и выверенных средиземноморских линий',
    aiAestheticVision: 'Художественное Видение',
    aiRecommendedFabrics: 'Рекомендуемые Благородные Ткани',
    aiArchitecturalDetails: 'Архитектурные Особенности Кроя',
    aiConsultationFocus: 'Фокус Первой Консультации в Ателье',

    sendDossierChoice: 'Отправить досье в ателье',
    btnBookWhatsapp: 'Через WhatsApp',
    btnSendTelegram: 'Через Telegram',
    btnSendDossier: 'Отправить досье в ателье',
    btnDownloadDossier: 'Сохранить картинку досье',
    btnDownloadingDossier: 'Сохранение картинки…',
    dossierVisualHeading: 'Ваше досье',
    dossierVisualSaved: 'Сохранённая картинка',
    dossierVisualTitle: 'Визуальное досье',
    dossierVisualClient: 'Клиент',
    dossierVisualPriorities: 'Приоритеты',
    dossierVisualPhotos: 'Фото',
    dossierFieldName: 'Имя',
    dossierFieldLocation: 'Локация',
    dossierFieldOccasion: 'Повод',
    dossierFieldDate: 'Дата',
    dossierFieldBudget: 'Бюджет',
    dossierFieldSilhouette: 'Силуэт',
    dossierFieldStyle: 'Стиль',
    dossierFieldColours: 'Цвета',
    dossierFieldFit: 'Посадка',
    dossierFieldSize: 'Размер',
    dossierFieldHeight: 'Рост',
    btnSending: 'Отправка...',
    btnSent: 'Досье отправлено',
    thankYouOrderLabel: 'Номер заказа',
    thankYouMessage:
      'Благодарим за обращение в MARGO Bridal & Special Occasion. В ближайшее время с Вами свяжется наш администратор.',
    thankYouClose: 'Закрыть',
    btnShare: 'Поделиться предложением',
    btnCopied: 'Ссылка скопирована',
    btnDashboard: 'Консоль Ателье',
    btnRestart: 'Создать Новое Консультационное Досье',

    dashConsoleBadge: 'Консоль Управления Ателье',
    dashTitle: 'Досье Консультаций',
    dashBackBtn: 'К анкете — без пароля',
    dashTotal: 'Всего Досье',
    dashNew: 'Новые Заявки',
    dashScheduled: 'Назначены Примерки',
    dashTgSync: 'Telegram Bot Sync',
    dashConnected: 'Подключено',
    dashSearchPlaceholder: 'Поиск по имени, номеру, поводу...',
    dashNoDossiers: 'Консультационные досье не найдены',
    dashNoDossiersSub: 'Создайте досье через приложение, чтобы увидеть его здесь.',
    dashFilterAll: 'Все',
    dashFilterNew: 'Новые',
    dashFilterScheduled: 'Назначенные',
    dashFilterFitting: 'Примерки',
    dashFilterArchive: 'Архив',
    dashArchiveBtn: 'Удалить',
    dashArchiveTitle: 'Удалить заявку?',
    dashArchiveText: 'Заявка будет перемещена в архив. Из архива её можно удалить безвозвратно.',
    dashArchiveConfirm: 'В архив',
    dashPurgeBtn: 'Удалить безвозвратно',
    dashPurgeTitle: 'Удалить безвозвратно?',
    dashPurgeText: 'Заявка будет удалена из архива без возможности восстановления. Введите пароль администратора.',
    dashPurgePassword: 'Пароль',
    dashPurgeConfirm: 'Удалить навсегда',
    dashCancel: 'Отмена',
    dashActionError: 'Не удалось выполнить действие.',
    statusNew: 'Новое обращение',
    statusContacted: 'Связались',
    statusScheduled: 'Примерка назначена',
    statusFitting: 'Макетирование (Toile)',
    statusCompleted: 'В производстве',

    footerSlogan: 'By appointment in Onrus · Online consultations available',
    footerWords: ['Свадебные платья', 'Вечерние образы', 'Ткани и аксессуары'],
  },
  en: {
    brandName: 'MARGO Bridal & Special Occasion',
    brandTagline: 'Made-to-order bridal & evening wear',
    badge: 'Look selection',
    appTitle: 'Your look for a special occasion',
    appIntro: [
      'Bridal and evening dresses, beautiful fabrics and accessories — at MARGO Bridal & Special Occasion in Onrus, Western Cape, South Africa.',
      'This short questionnaire helps you clarify your wishes and helps us prepare for your first appointment.',
    ],
    stats: {
      time: { title: 'Short survey', desc: 'Your event and wishes' },
      ai: { title: 'Your style', desc: 'Silhouettes, fabrics & details' },
      privacy: { title: 'Private meeting', desc: 'In atelier or online' },
    },
    startBtn: 'Explore Your Look',
    bookConsultationBtn: 'Book a Consultation',
    bookConsultationHint: 'A short form to book your consultation',
    startBtnHint: 'Choose silhouettes, colours and details you love',
    virtualTryOnBtn: 'Order a Virtual Try-On',
    virtualTryOnHint: 'See your chosen look on your photo — a separate paid service',
    virtualTryOnPromo:
      'You have a unique opportunity to see your chosen dress model on yourself before it is made. This service is paid separately.',
    exploreIntroBadge: 'Look selection',
    exploreIntroTitle: 'How the',
    exploreIntroTitleItalic: 'journey works',
    exploreIntroBody: [
      'Tell us about your event and choose looks you like. At the consultation we will discuss suitable silhouettes, fabrics and details — to select a ready dress or order from a chosen model.',
      'Atelier appointments are by prior booking. Online consultations are also available.',
    ],
    exploreIntroNext: 'Continue',
    bookBadge: 'Quick request',
    bookTitle: 'Book a',
    bookTitleItalic: 'consultation',
    bookSubtitle: 'A short form — without the full look journey. We will contact you on WhatsApp.',
    bookNameLabel: 'Name',
    bookNamePlaceholder: 'How should we address you',
    bookWaLabel: 'WhatsApp',
    bookWaPlaceholder: '+27 / +7 / +39…',
    bookSubmitBtn: 'Submit request',
    bookSubmitting: 'Sending…',
    bookSuccessTitle: 'Request sent',
    bookSuccessText: (id) => `Reference ${id}. Our coordinator will message you on WhatsApp.`,
    bookError: 'Could not send. Check your details and try again.',
    bookBackHome: 'Back home',
    tryonBadge: 'Paid service',
    tryonTitle: 'Virtual',
    tryonTitleItalic: 'Try-On',
    tryonIntro: [
      'See your chosen look on your own photograph',
      'Imagine how a selected dress model or colour could look on you before placing an order. Each image is created and reviewed personally by the MARGO designer.',
    ],
    tryonOriginalLabel: 'Your photo',
    tryonResultLabel: 'Try-on result',
    tryonDressLabel: 'Dress model',
    tryonExamplesLabel: 'Example result',
    tryonVideoLabel: 'Try-on video',
    tryonPriceNote: 'This is a separate paid service. Details and pricing are confirmed on WhatsApp.',
    tryonPricingTitle: 'Service pricing',
    tryonPackageOneTitle: 'One look — R350',
    tryonPackageOneBody:
      'One chosen dress on your photograph. Includes one final image and one small adjustment.',
    tryonPackageThreeTitle: 'Three looks — R750',
    tryonPackageThreeBody:
      'Compare three dress models or colour options on one photograph. Includes three final images and one round of small adjustments.',
    tryonHowTitle: 'How it works',
    tryonHowSteps: [
      'Upload a clear full-length photograph.',
      'Choose one or three looks.',
      'Pay for the service.',
      'Receive your images within two working days after payment, a suitable photo, and your selected looks are received.',
    ],
    tryonPricingNotes: [
      'Small adjustments include a colour change or sleeve length. A different dress model counts as a new look.',
      'The service is available separately — ordering a dress is not required. If you order a dress with MARGO, the virtual try-on fee is credited toward its cost.',
      'Virtual try-on helps you visualise a look. Exact fit, fabric and construction are confirmed in consultation and fittings during the making process. All dresses are made to order only.',
    ],
    tryonTariffTitle: 'Choose a package',
    tryonTariffSubtitle: 'Pay with PayPal · currency ZAR (South Africa)',
    tryonTariffOneTitle: 'One look',
    tryonTariffOnePrice: 'R350',
    tryonTariffOneDesc: 'One dress on your photograph · one final image · one small adjustment',
    tryonTariffThreeTitle: 'Three looks',
    tryonTariffThreePrice: 'R750',
    tryonTariffThreeDesc: 'Three models or colours on one photograph · three final images · one round of adjustments',
    tryonTariffBack: 'Back to form',
    tryonPayTitle: 'PayPal checkout',
    tryonPaySubtitle: (amount) => `Order total: ${amount} ZAR`,
    tryonSaAgreement:
      'I confirm the Virtual Try-On service agreement under the laws of the Republic of South Africa, including the Consumer Protection Act 68 of 2008, and I accept the terms and price of the selected package.',
    tryonPayBtn: 'Pay',
    tryonPayBack: 'Back to packages',
    tryonPayLoading: 'Loading PayPal…',
    tryonPayNotConfigured:
      'PayPal is not connected yet. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to the server settings.',
    tryonPayError: 'Payment could not be completed. Please try again.',
    tryonNameLabel: 'Name',
    tryonNamePlaceholder: 'How should we address you',
    tryonWaLabel: 'WhatsApp',
    tryonWaPlaceholder: '+27 / +7 / +39…',
    tryonNoteLabel: 'Notes',
    tryonNotePlaceholder: 'Occasion, dress style, reference links…',
    tryonUploadTitle: 'Your photos',
    tryonUploadHint: 'Upload up to 4 personal photos for the try-on',
    tryonUploadLimits: 'JPG, PNG or WebP · up to 8 MB each · max 4',
    tryonUploadMax: 'You can upload up to 4 photos',
    tryonUploadRequired: 'Please add at least one personal photo',
    tryonAtelierTitle: 'Atelier looks',
    tryonAtelierHint: 'Choose one or more looks from the MARGO collection for your virtual try-on',
    tryonAtelierBtn: 'Add a look from our atelier',
    tryonAtelierMax: 'You can select up to 3 atelier looks',
    tryonAtelierRequired: 'Please select at least one atelier look',
    tryonAtelierSelected: 'Selected looks',
    tryonOrderNumberLabel: 'Order number',
    tryonSubmitBtn: 'Order',
    tryonWhatsappHelp: 'If you still have questions, you can contact us on WhatsApp',
    tryonSubmitting: 'Sending…',
    tryonSuccessTitle: 'Request received',
    tryonSuccessText: (id) => `Order number ${id}. We will message you on WhatsApp about photos and looks.`,
    tryonError: 'Could not send. Please try again.',
    tryonBackHome: 'Back home',
    citiesFooter: 'By appointment in Onrus · Online consultations available',
    citiesFooterSub: '',
    headerWhatsappLabel: 'Consultation WhatsApp',
    headerWhatsappNumber: '+27 76 364 3600',
    consentTitle: 'User agreement',
    consentIntro:
      'Before starting look selection, please confirm the terms of use and consent to personal data processing.',
    consentTermsTitle: 'Terms of use',
    consentTermsBody: [
      'The MARGO Bridal & Special Occasion service helps prepare your wishes for a bridal or evening dress consultation.',
      'Questionnaire answers are used only to prepare for an atelier or online meeting and are not a public offer.',
      'The final choice of model, fabric, price and timing is confirmed at the consultation.',
    ],
    consentPrivacyTitle: 'Personal data processing',
    consentPrivacyBody: [
      'You consent to processing of the data you provide: name, contacts, fit preferences, look wishes and uploaded images.',
      'Data is stored to arrange the consultation and for the atelier workflow (including Telegram notification).',
      'You may request clarification or deletion of your data by contacting the atelier.',
    ],
    consentTermsCheck: 'I accept the terms of use',
    consentPrivacyCheck: 'I consent to personal data processing',
    consentAcceptBtn: 'Accept and continue',
    consentCancelBtn: 'Cancel',
    adminLoginTitle: 'Atelier console login',
    adminLoginHint: 'Staff only. Password is required to view client dossiers.',
    adminLoginStaffNote: 'To fill the questionnaire as a client, no password is needed — tap “Back to questionnaire” below.',
    adminPasswordLabel: 'Password',
    adminPasswordPlaceholder: 'Access password',
    adminLoginBtn: 'Sign in',
    adminLoginError: 'Could not sign in. Please try again.',
    adminLoginErrorUnauthorized: 'Wrong password.',
    adminLoginErrorNotConfigured: 'Admin password is not configured. Set ADMIN_PASSWORD in .env and restart the server.',
    adminLoginErrorOffline: 'The server is not responding. Start the app with npm run dev and try again.',
    adminSessionExpired: 'Your session expired. Enter the password again.',
    adminLogoutBtn: 'Sign out',

    atelierDeskBtn: 'Atelier Desk',
    clientAppBtn: 'Questionnaire',
    stepIndicator: (current, total) => `Step ${String(current).padStart(2, '0')} of ${String(total).padStart(2, '0')}`,
    headerSub: 'Consultation',

    step01Badge: 'Step 01 · Occasion & format',
    step01Title: 'Your special',
    step01TitleItalic: 'occasion',
    step01Subtitle:
      'Every piece begins with the context, light and atmosphere of the upcoming event.',
    step01PhotoNote:
      'Images convey mood and style direction. Availability of models and the possibility of making will be confirmed at the consultation.',
    step01Continue: 'Next: about your event',
    step01SelectHint: 'Select an occasion',

    step02Badge: 'Step 02 · Your Event',
    step02Title: 'When and where is',
    step02TitleItalic: 'your event?',
    step02Subtitle:
      'Tell us about the date and venue. This helps us suggest a suitable look and discuss time for dress selection, possible alterations, or made-to-order.',
    step02DateLabel: 'Event date — if already known',
    step02DatePlaceholder: 'Select a date',
    step02TimelineLabel: 'How much time is left until the event?',
    step02TimelineNote: 'Order options and production timelines are confirmed at the consultation.',
    step02TimelineAutoHint: 'Timeline calculated from the selected date',
    step02SettingLabel: 'Where and in what format will the event take place?',
    step02SettingHint: 'Select all that apply.',
    step02OtherLabel: 'Briefly describe the place or format of the event.',
    step02OtherPlaceholder: 'Short description of place or format',
    step02CityLabel: 'In which city or region will the event take place?',
    step02CityPlaceholder: 'Enter a city or region.',
    step02Continue: 'Next: your budget and preferences',
    step02PageFooterBrand: 'MARGO Bridal & Special Occasion',
    step02PageFooterPlace: 'Onrus, Western Cape, South Africa',
    step02PageFooterMode: 'In atelier and online',

    step03Badge: 'Step 03 · Format & Budget',
    step03Title: 'Which option feels',
    step03TitleItalic: 'closer to you?',
    step03Subtitle:
      'Choose a direction and a comfortable budget guide. This helps us prepare suitable proposals for your consultation.',
    step03Disclaimer:
      'The prices shown are preliminary guides. The final cost depends on the model, fabric, construction and finishing, and is agreed before production begins. All prices are shown in South African rand — ZAR / R.',
    step03IncludedBadge: 'Included:',
    step03Continue: 'Continue to Silhouette Line',
    step03SelectHint: 'Select an option',
    step03PageFooterBrand: 'MARGO Bridal & Special Occasion',
    step03PageFooterPlace: 'Onrus, Western Cape, South Africa',
    step03PageFooterMode: 'Consultations in atelier and online.',

    step04Badge: 'Step 04 · Silhouette Choice',
    step04Title: 'Which silhouette',
    step04TitleItalic: 'do you like?',
    step04Subtitle:
      'Choose one or more options that feel close to you. At the fitting we will help refine the shape, fit and details around your wishes.',
    step04Note:
      'Images help you choose a style direction. Fabric, colour, details and production options are discussed at the consultation.',
    step04Continue: 'Next: style and details',
    step04SelectHint: 'Select a silhouette',
    step04PageFooterBrand: 'MARGO Bridal & Special Occasion',
    step04PageFooterPlace: 'Onrus, Western Cape, South Africa',
    step04PageFooterMode: 'In atelier and online',
    step04PageFooterTag: 'Dresses · Fabrics · Accessories',

    step05Badge: 'Step 05 · Style & Mood',
    step05Title: 'How do you see',
    step05TitleItalic: 'your look?',
    step05Subtitle:
      'Restrained, romantic, expressive or sensual? Choose one or more directions that feel close to you. We will discuss the details at the consultation.',
    step05Continue: 'Next: fabrics and colours',
    step05SelectHint: 'Select a direction',
    step05PageFooterBrand: 'MARGO Bridal & Special Occasion',
    step05PageFooterPlace: 'Onrus, Western Cape, South Africa',
    step05PageFooterMode: 'In atelier and online',

    step06Badge: 'Step 06 · Fabrics & Colours',
    step06Title: 'Palette of',
    step06TitleItalic: 'your look',
    step06Subtitle:
      'Light bridal shades, soft pastels and deep evening colours. Choose up to two tones that feel close to you.',
    step06CustomLabel: 'Another shade or wishes',
    step06CustomOptional: 'Optional field',
    step06CustomPlaceholder:
      'For example: a cool light shade, a soft glow, or a combination of two colours.',
    step06Disclaimer:
      'The colour on screen may differ from the real fabric shade. We will make the final choice from samples. Availability of the tone and enough fabric will be confirmed at the consultation.',
    step06Continue: 'Next: proportions and fit',
    step06SelectHint: 'Select a shade',
    step06PageFooterBrand: 'MARGO Bridal & Special Occasion',
    step06PageFooterPlace: 'Onrus, Western Cape, South Africa',
    step06PageFooterMode: 'In atelier and online',

    step07Badge: 'Step 07 · Fit and comfort',
    step07Title: 'What matters to you',
    step07TitleItalic: 'in how the dress fits?',
    step07Subtitle:
      'A defined waist, a soft follow of the body, or more ease? Share your preferences — this helps us choose the right model.',
    step07HeightLabel: 'Your height, cm',
    step07HeightOptional: 'Optional field',
    step07HeightPlaceholder: 'For example: 165 — without shoes.',
    step07SizeLabel: 'Your usual clothing size',
    step07SizeOptional: 'Optional field',
    step07SizePlaceholder: 'Choose a size or “Not sure”.',
    step07SizeDefault: 'Select a size',
    step07SizeDontKnow: 'Not sure',
    step07SizeHint:
      'Size helps us orient. Exact measurements and fit will be refined when preparing the order.',
    step07FitLabel: 'Which fit feels closer to you?',
    step07FitHint: 'You can choose several options.',
    step07NotesLabel: 'Your wishes',
    step07NotesOptional: 'Optional field',
    step07NotesPlaceholder:
      'For example: I want to wear a regular bra, prefer covered arms, need ease around the midsection, or comfort for dancing.',
    step07Continue: 'Next: your ideas and examples',
    step07PageFooterBrand: 'MARGO Bridal & Special Occasion',
    step07PageFooterPlace: 'Onrus, Western Cape, South Africa',
    step07PageFooterMode: 'In atelier and online',

    step08Badge: 'Step 08 · Visual References',
    step08Title: 'Moodboard &',
    step08TitleItalic: 'inspiration',
    step08Subtitle: 'Upload up to 3 photographs, sketches, or link your private moodboard.',
    step08UploadTitle: (count) => `Upload Reference Images (${count}/3)`,
    step08UploadSubtitle: 'Drag & drop here or click to select from your device.',
    step08UploadLimits: 'JPG, PNG, WebP up to 8MB',
    step08CuratedLabel: 'Or choose looks from the collection',
    step08GalleryHint: 'Up to 3 photos. Selected ones are added to your upload.',
    step08GalleryMax: 'You can select no more than 3 images.',
    step08LinkNotesLabel: 'Pinterest / Instagram Link or Aesthetic Notes',
    step08LinkNotesPlaceholder: 'Paste Pinterest / Instagram link or describe silhouettes you love...',
    step08Continue: 'Continue to Priorities',

    step09Badge: 'Step 09 · Creative Priorities',
    step09Title: 'What matters',
    step09TitleItalic: 'most?',
    step09Subtitle: 'Guide our Master Couturier on the core values of your piece. Select 1 to 3 priorities.',
    step09Continue: (count) => count > 0 ? `Continue (${count} Selected)` : 'Select at Least 1 Priority',

    step10Badge: 'Step 10 · Client Dossier',
    step10Title: 'How shall we',
    step10TitleItalic: 'address you?',
    step10Subtitle: 'Your details are treated with the highest discretion by our atelier team.',
    step10NameLabel: 'Your Full Name *',
    step10NamePlaceholder: 'e.g. Elena Rostova',
    step10TgLabel: 'Telegram Handle (@username)',
    step10TgHint: 'Our atelier coordinator will connect with you directly in Telegram.',
    step10WaLabel: 'WhatsApp Phone Number',
    step10VenueLabel: 'Preferred Consultation Venue',
    step10LangLabel: 'Consultation Language',
    step10GenerateBtn: 'Generate Consultation Summary & AI Direction',

    summaryRef: 'Dossier Ref:',
    summaryTitle: 'Your Consultation',
    summaryTitleItalic: 'Summary',
    summaryPreparedFor: (name, loc) => `Prepared for ${name || 'Client'} · ${loc}`,
    summaryTransmittedBannerTitle: 'Dossier sent',
    summaryTransmittedBannerText: 'Thank you for contacting MARGO Bridal & Special Occasion. Our administrator will be in touch with you shortly.',
    aestheticDirection: 'Aesthetic Direction',
    specTimeline: 'Timeline',
    specProportions: 'Proportions',
    specFit: 'Fit Sensation',
    specVenue: 'Venue',
    selectedPalette: 'Selected palette',
    clientPriorities: 'Client Priorities',
    clientReferencesTitle: (count) => `Your Uploaded References (${count})`,

    aiGeminiBadge: 'Gemini Intelligence',
    aiDirectionTitle: 'AI Style Direction',
    aiRegenerate: 'Regenerate',
    aiLoadingTitle: 'Synthesizing bespoke couture architecture...',
    aiLoadingSub: 'Curating noble Como silks & Mediterranean lines',
    aiAestheticVision: 'Aesthetic Vision',
    aiRecommendedFabrics: 'Recommended Noble Fabrics',
    aiArchitecturalDetails: 'Architectural Cut Details',
    aiConsultationFocus: 'Atelier Consultation Focus Points',

    sendDossierChoice: 'Send dossier to the atelier',
    btnBookWhatsapp: 'Via WhatsApp',
    btnSendTelegram: 'Via Telegram',
    btnSendDossier: 'Send dossier to the atelier',
    btnDownloadDossier: 'Save dossier image',
    btnDownloadingDossier: 'Saving image…',
    dossierVisualHeading: 'Your dossier',
    dossierVisualSaved: 'Saved image',
    dossierVisualTitle: 'Visual dossier',
    dossierVisualClient: 'Client',
    dossierVisualPriorities: 'Priorities',
    dossierVisualPhotos: 'Photos',
    dossierFieldName: 'Name',
    dossierFieldLocation: 'Location',
    dossierFieldOccasion: 'Occasion',
    dossierFieldDate: 'Date',
    dossierFieldBudget: 'Budget',
    dossierFieldSilhouette: 'Silhouette',
    dossierFieldStyle: 'Style',
    dossierFieldColours: 'Colours',
    dossierFieldFit: 'Fit',
    dossierFieldSize: 'Size',
    dossierFieldHeight: 'Height',
    btnSending: 'Sending...',
    btnSent: 'Dossier sent',
    thankYouOrderLabel: 'Order number',
    thankYouMessage:
      'Thank you for contacting MARGO Bridal & Special Occasion. Our administrator will be in touch with you shortly.',
    thankYouClose: 'Close',
    btnShare: 'Share Dossier',
    btnCopied: 'Link Copied',
    btnDashboard: 'Atelier Dashboard',
    btnRestart: 'Create Another Consultation Dossier',

    dashConsoleBadge: 'Live Atelier Console',
    dashTitle: 'Consultation Dossiers',
    dashBackBtn: 'Back to questionnaire — no password',
    dashTotal: 'Total Dossiers',
    dashNew: 'New Inquiries',
    dashScheduled: 'Scheduled Fittings',
    dashTgSync: 'Telegram Bot Sync',
    dashConnected: 'Connected',
    dashSearchPlaceholder: 'Search client, ID, occasion...',
    dashNoDossiers: 'No consultation dossiers found',
    dashNoDossiersSub: 'Submit a consultation via the client app to see it populate here.',
    dashFilterAll: 'all',
    dashFilterNew: 'new',
    dashFilterScheduled: 'scheduled',
    dashFilterFitting: 'fitting',
    dashFilterArchive: 'Archive',
    dashArchiveBtn: 'Delete',
    dashArchiveTitle: 'Delete this request?',
    dashArchiveText: 'The request will be moved to the archive. It can be permanently deleted from there.',
    dashArchiveConfirm: 'Move to archive',
    dashPurgeBtn: 'Delete permanently',
    dashPurgeTitle: 'Delete permanently?',
    dashPurgeText: 'The request will be removed from the archive and cannot be restored. Enter the administrator password.',
    dashPurgePassword: 'Password',
    dashPurgeConfirm: 'Delete forever',
    dashCancel: 'Cancel',
    dashActionError: 'Could not complete this action.',
    statusNew: 'New Inbound',
    statusContacted: 'Contacted',
    statusScheduled: 'Fitting Scheduled',
    statusFitting: 'Toile Prototype',
    statusCompleted: 'In Production',

    footerSlogan: 'By appointment in Onrus · Online consultations available',
    footerWords: ['Bridal dresses', 'Evening looks', 'Fabrics & accessories'],
  },
};
