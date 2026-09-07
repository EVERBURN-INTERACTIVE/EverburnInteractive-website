export type LookingForId =
  | 'business-website'
  | 'interactive-website'
  | '3d-website'
  | 'landing-page'
  | 'product-showcase'
  | 'redesign'
  | 'not-sure';

export type MainGoalId =
  | 'leads'
  | 'sell'
  | 'showcase-business'
  | 'showcase-product'
  | 'credibility'
  | 'information'
  | 'other';

export type HasWebsiteId = 'yes' | 'no' | '';

export type IncludeId =
  | 'home'
  | 'about'
  | 'services'
  | 'products'
  | 'portfolio'
  | 'pricing'
  | 'blog'
  | 'contact'
  | 'booking'
  | 'ecommerce'
  | 'login'
  | 'forms'
  | 'whatsapp'
  | 'maps'
  | 'animations'
  | 'interactive'
  | '3d-elements'
  | 'custom'
  | 'other';

export type SiteSizeId = '1' | '2-5' | '6-10' | '10+' | 'unsure';

export type ThreeDUseId =
  | 'product'
  | 'property'
  | 'architecture'
  | 'interior'
  | 'vehicle'
  | 'machinery'
  | 'brand'
  | 'game'
  | 'other';

export type HasModelsId = 'ready' | 'need-prep' | 'no' | 'unsure' | '';

export type ThreeDActionId =
  | 'rotate'
  | 'zoom'
  | 'materials'
  | 'configure'
  | 'explore'
  | 'click-objects'
  | 'info'
  | 'walk'
  | 'other';

export type BudgetId =
  | 'under-10k'
  | '10-20k'
  | '20-30k'
  | '30-50k'
  | '50-100k'
  | '100k-plus'
  | 'unsure';

export type TimelineId = 'asap' | '2-4-weeks' | '1-2-months' | '2-3-months' | 'no-deadline' | 'exploring';

export type AssetId =
  | 'logo'
  | 'brand-guidelines'
  | 'photos'
  | 'videos'
  | 'written'
  | 'product-copy'
  | '3d-models'
  | 'existing-site'
  | 'none'
  | 'other';

export type ContentProvisionId = 'everything' | 'most' | 'need-help' | 'unsure' | '';

export type VisualStyleId =
  | 'minimal'
  | 'premium'
  | 'corporate'
  | 'bold'
  | 'dark-futuristic'
  | 'playful'
  | 'cinematic'
  | 'recommend'
  | '';

export type ContactMethodId = 'whatsapp' | 'phone' | 'email' | '';

export type ContactTimeId = 'morning' | 'afternoon' | 'evening' | 'anytime' | '';

export type ChapterId =
  | 'arrival'
  | 'lookingFor'
  | 'goal'
  | 'business'
  | 'scope'
  | 'size'
  | 'threeD'
  | 'budget'
  | 'timeline'
  | 'assets'
  | 'design'
  | 'contact'
  | 'success'
  | 'review';

export interface ChoiceOption<T extends string> {
  id: T;
  label: string;
}

export interface BuildInquiry {
  lookingFor: LookingForId | '';
  mainGoal: MainGoalId | '';
  goalOther: string;
  businessName: string;
  industry: string;
  cityCountry: string;
  businessDescription: string;
  hasWebsite: HasWebsiteId;
  currentWebsiteUrl: string;
  includes: IncludeId[];
  includesOther: string;
  siteSize: SiteSizeId | '';
  threeDUse: ThreeDUseId[];
  threeDUseOther: string;
  hasModels: HasModelsId;
  threeDActions: ThreeDActionId[];
  threeDActionsOther: string;
  budget: BudgetId | '';
  timeline: TimelineId | '';
  launchEvent: string;
  assets: AssetId[];
  assetsOther: string;
  contentProvision: ContentProvisionId;
  visualStyle: VisualStyleId;
  likedWebsites: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyRole: string;
  contactMethod: ContactMethodId;
  contactTime: ContactTimeId;
  successDefinition: string;
  honeypot: string;
}

export const LOOKING_FOR_OPTIONS: ChoiceOption<LookingForId>[] = [
  { id: 'business-website', label: 'Business website' },
  { id: 'interactive-website', label: 'Interactive website' },
  { id: '3d-website', label: '3D website' },
  { id: 'landing-page', label: 'Landing page' },
  { id: 'product-showcase', label: 'Interactive product showcase' },
  { id: 'redesign', label: 'Redesign my existing website' },
  { id: 'not-sure', label: 'Not sure yet' },
];

export const MAIN_GOAL_OPTIONS: ChoiceOption<MainGoalId>[] = [
  { id: 'leads', label: 'Get more customers / leads' },
  { id: 'sell', label: 'Sell products / services' },
  { id: 'showcase-business', label: 'Showcase my business' },
  { id: 'showcase-product', label: 'Showcase a product / property' },
  { id: 'credibility', label: 'Build credibility / brand presence' },
  { id: 'information', label: 'Provide information' },
  { id: 'other', label: 'Other' },
];

export const INCLUDE_OPTIONS: ChoiceOption<IncludeId>[] = [
  { id: 'home', label: 'Home page' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'products', label: 'Products' },
  { id: 'portfolio', label: 'Portfolio / Gallery' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'blog', label: 'Blog / News' },
  { id: 'contact', label: 'Contact' },
  { id: 'booking', label: 'Booking / Appointments' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'login', label: 'Customer login' },
  { id: 'forms', label: 'Forms / Lead capture' },
  { id: 'whatsapp', label: 'WhatsApp integration' },
  { id: 'maps', label: 'Maps / Location' },
  { id: 'animations', label: 'Animations' },
  { id: 'interactive', label: 'Interactive elements' },
  { id: '3d-elements', label: '3D elements' },
  { id: 'custom', label: 'Custom functionality' },
  { id: 'other', label: 'Other' },
];

export const SITE_SIZE_OPTIONS: ChoiceOption<SiteSizeId>[] = [
  { id: '1', label: '1 page' },
  { id: '2-5', label: '2-5 pages' },
  { id: '6-10', label: '6-10 pages' },
  { id: '10+', label: '10+ pages' },
  { id: 'unsure', label: 'Not sure' },
];

export const THREE_D_USE_OPTIONS: ChoiceOption<ThreeDUseId>[] = [
  { id: 'product', label: 'Product visualization' },
  { id: 'property', label: 'Property / real estate' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'interior', label: 'Interior / spaces' },
  { id: 'vehicle', label: 'Vehicle' },
  { id: 'machinery', label: 'Machinery / industrial equipment' },
  { id: 'brand', label: 'Interactive brand experience' },
  { id: 'game', label: 'Game / entertainment' },
  { id: 'other', label: 'Other' },
];

export const HAS_MODELS_OPTIONS: ChoiceOption<Exclude<HasModelsId, ''>>[] = [
  { id: 'ready', label: 'Yes, ready to use' },
  { id: 'need-prep', label: 'Yes, but they need work' },
  { id: 'no', label: 'No' },
  { id: 'unsure', label: "I'm not sure" },
];

export const THREE_D_ACTION_OPTIONS: ChoiceOption<ThreeDActionId>[] = [
  { id: 'rotate', label: 'Rotate / inspect' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'materials', label: 'Change colours / materials' },
  { id: 'configure', label: 'Configure the product' },
  { id: 'explore', label: 'Explore a space' },
  { id: 'click-objects', label: 'Click interactive objects' },
  { id: 'info', label: 'View information' },
  { id: 'walk', label: 'Walk around' },
  { id: 'other', label: 'Other' },
];

export const BUDGET_OPTIONS: ChoiceOption<BudgetId>[] = [
  { id: 'under-10k', label: 'Under ₹10,000' },
  { id: '10-20k', label: '₹10,000-₹20,000' },
  { id: '20-30k', label: '₹20,000-₹30,000' },
  { id: '30-50k', label: '₹30,000-₹50,000' },
  { id: '50-100k', label: '₹50,000-₹1,00,000' },
  { id: '100k-plus', label: '₹1,00,000+' },
  { id: 'unsure', label: "I'm not sure" },
];

export const TIMELINE_OPTIONS: ChoiceOption<TimelineId>[] = [
  { id: 'asap', label: 'As soon as possible' },
  { id: '2-4-weeks', label: 'Within 2-4 weeks' },
  { id: '1-2-months', label: '1-2 months' },
  { id: '2-3-months', label: '2-3 months' },
  { id: 'no-deadline', label: 'No fixed deadline' },
  { id: 'exploring', label: 'Just exploring' },
];

export const ASSET_OPTIONS: ChoiceOption<AssetId>[] = [
  { id: 'logo', label: 'Logo' },
  { id: 'brand-guidelines', label: 'Brand guidelines' },
  { id: 'photos', label: 'Product photographs' },
  { id: 'videos', label: 'Videos' },
  { id: 'written', label: 'Written content' },
  { id: 'product-copy', label: 'Product descriptions' },
  { id: '3d-models', label: '3D models' },
  { id: 'existing-site', label: 'Existing website content' },
  { id: 'none', label: 'None of these' },
  { id: 'other', label: 'Other' },
];

export const CONTENT_PROVISION_OPTIONS: ChoiceOption<Exclude<ContentProvisionId, ''>>[] = [
  { id: 'everything', label: 'Yes, we have everything' },
  { id: 'most', label: 'We have most of it' },
  { id: 'need-help', label: 'We need help creating it' },
  { id: 'unsure', label: 'Not sure yet' },
];

export const VISUAL_STYLE_OPTIONS: ChoiceOption<Exclude<VisualStyleId, ''>>[] = [
  { id: 'minimal', label: 'Minimal / clean' },
  { id: 'premium', label: 'Premium / luxury' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'bold', label: 'Bold / modern' },
  { id: 'dark-futuristic', label: 'Dark / futuristic' },
  { id: 'playful', label: 'Colourful / playful' },
  { id: 'cinematic', label: 'Immersive / cinematic' },
  { id: 'recommend', label: 'You choose' },
];

export const CONTACT_METHOD_OPTIONS: ChoiceOption<Exclude<ContactMethodId, ''>>[] = [
  { id: 'phone', label: 'Call' },
  { id: 'email', label: 'Mail' },
  { id: 'whatsapp', label: 'WhatsApp' },
];

export const CONTACT_TIME_OPTIONS: ChoiceOption<Exclude<ContactTimeId, ''>>[] = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
  { id: 'anytime', label: 'Anytime' },
];

export const EMPTY_INQUIRY: BuildInquiry = {
  lookingFor: '',
  mainGoal: '',
  goalOther: '',
  businessName: '',
  industry: '',
  cityCountry: '',
  businessDescription: '',
  hasWebsite: '',
  currentWebsiteUrl: '',
  includes: [],
  includesOther: '',
  siteSize: '',
  threeDUse: [],
  threeDUseOther: '',
  hasModels: '',
  threeDActions: [],
  threeDActionsOther: '',
  budget: '',
  timeline: '',
  launchEvent: '',
  assets: [],
  assetsOther: '',
  contentProvision: '',
  visualStyle: '',
  likedWebsites: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  companyRole: '',
  contactMethod: '',
  contactTime: '',
  successDefinition: '',
  honeypot: '',
};

export const BUILD_DRAFT_KEY = 'everburn.build-inquiry.v1';

export function needs3DChapter(inquiry: Pick<BuildInquiry, 'lookingFor' | 'includes'>): boolean {
  return inquiry.lookingFor === '3d-website' || inquiry.includes.includes('3d-elements');
}

export function getChapterSequence(inquiry: Pick<BuildInquiry, 'lookingFor' | 'includes'>): ChapterId[] {
  const chapters: ChapterId[] = [
    'arrival',
    'lookingFor',
    'goal',
    'business',
    'scope',
    'size',
  ];

  if (needs3DChapter(inquiry)) {
    chapters.push('threeD');
  }

  chapters.push('budget', 'timeline', 'assets', 'design', 'contact', 'success', 'review');
  return chapters;
}

export function budgetHeat(budget: BudgetId | ''): number {
  switch (budget) {
    case 'under-10k':
      return 0.22;
    case '10-20k':
      return 0.34;
    case '20-30k':
      return 0.48;
    case '30-50k':
      return 0.62;
    case '50-100k':
      return 0.78;
    case '100k-plus':
      return 1;
    case 'unsure':
      return 0.4;
    default:
      return 0.18;
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/\S+$/i;

function digitCount(value: string): number {
  return value.replace(/\D/g, '').length;
}

export function createEmptyInquiry(): BuildInquiry {
  return { ...EMPTY_INQUIRY, includes: [], threeDUse: [], threeDActions: [], assets: [] };
}

export function toggleMulti<T extends string>(current: T[], id: T, exclusive?: T): T[] {
  if (exclusive && id === exclusive) {
    return current.includes(id) ? [] : [id];
  }

  const withoutExclusive = exclusive ? current.filter((item) => item !== exclusive) : current;
  return withoutExclusive.includes(id)
    ? withoutExclusive.filter((item) => item !== id)
    : [...withoutExclusive, id];
}

export function labelFor<T extends string>(options: ChoiceOption<T>[], id: T | ''): string {
  if (!id) {
    return '';
  }

  return options.find((option) => option.id === id)?.label ?? id;
}

export function labelsFor<T extends string>(options: ChoiceOption<T>[], ids: T[]): string {
  return ids.map((id) => labelFor(options, id)).filter(Boolean).join(', ');
}

export interface ChapterErrors {
  [field: string]: string;
}

export function validateChapter(chapter: ChapterId, inquiry: BuildInquiry): ChapterErrors {
  const errors: ChapterErrors = {};

  if (chapter === 'lookingFor' && !inquiry.lookingFor) {
    errors.lookingFor = 'Choose what you would like us to build.';
  }

  if (chapter === 'goal') {
    if (!inquiry.mainGoal) {
      errors.mainGoal = 'Choose the main goal of the website.';
    }
    if (inquiry.mainGoal === 'other' && inquiry.goalOther.trim().length < 3) {
      errors.goalOther = 'Tell us the goal in a few words.';
    }
  }

  if (chapter === 'business') {
    if (inquiry.businessName.trim().length < 2) {
      errors.businessName = 'Enter the business or brand name.';
    }
    if (inquiry.industry.trim().length < 2) {
      errors.industry = 'Enter the industry or business type.';
    }
    if (inquiry.cityCountry.trim().length < 2) {
      errors.cityCountry = 'Enter city and country.';
    }
    if (inquiry.businessDescription.trim().length < 12) {
      errors.businessDescription = 'Give us a short description of the business.';
    }
    if (inquiry.hasWebsite === 'yes') {
      const url = inquiry.currentWebsiteUrl.trim();
      if (!url || !URL_PATTERN.test(url)) {
        errors.currentWebsiteUrl = 'Add the current website URL, starting with https://';
      }
    }
  }

  if (chapter === 'scope') {
    if (inquiry.includes.length === 0) {
      errors.includes = 'Select at least one thing the website should include.';
    }
    if (inquiry.includes.includes('other') && inquiry.includesOther.trim().length < 2) {
      errors.includesOther = 'Tell us what else to include.';
    }
  }

  if (chapter === 'size' && !inquiry.siteSize) {
    errors.siteSize = 'Choose an approximate size.';
  }

  if (chapter === 'threeD') {
    if (inquiry.threeDUse.length === 0) {
      errors.threeDUse = 'Select what the 3D experience is for.';
    }
    if (inquiry.threeDUse.includes('other') && inquiry.threeDUseOther.trim().length < 2) {
      errors.threeDUseOther = 'Tell us how you want to use 3D.';
    }
    if (!inquiry.hasModels) {
      errors.hasModels = 'Tell us whether you already have 3D models.';
    }
    if (inquiry.threeDActions.length === 0) {
      errors.threeDActions = 'Select what visitors should be able to do.';
    }
    if (inquiry.threeDActions.includes('other') && inquiry.threeDActionsOther.trim().length < 2) {
      errors.threeDActionsOther = 'Describe the extra 3D interaction.';
    }
  }

  if (chapter === 'budget' && !inquiry.budget) {
    errors.budget = 'Choose a budget range.';
  }

  if (chapter === 'timeline' && !inquiry.timeline) {
    errors.timeline = 'Choose a launch window.';
  }

  if (chapter === 'assets') {
    if (inquiry.assets.length === 0) {
      errors.assets = 'Select what you already have, or choose None of these.';
    }
    if (inquiry.assets.includes('other') && inquiry.assetsOther.trim().length < 2) {
      errors.assetsOther = 'Tell us what other assets you have.';
    }
    if (!inquiry.contentProvision) {
      errors.contentProvision = 'Tell us whether you will provide the content.';
    }
  }

  if (chapter === 'design' && !inquiry.visualStyle) {
    errors.visualStyle = 'Choose a visual direction, or ask us to recommend one.';
  }

  if (chapter === 'contact') {
    if (inquiry.contactName.trim().length < 2) {
      errors.contactName = 'Enter your name.';
    }
    if (!EMAIL_PATTERN.test(inquiry.contactEmail.trim())) {
      errors.contactEmail = 'Enter a valid email address.';
    }
    if (digitCount(inquiry.contactPhone) < 10) {
      errors.contactPhone = 'Enter a phone or WhatsApp number.';
    }
    if (!inquiry.contactMethod) {
      errors.contactMethod = 'Choose your preferred method of contact.';
    }
    if (!inquiry.contactTime) {
      errors.contactTime = 'Choose the best time to contact you.';
    }
  }

  if (chapter === 'success' && inquiry.successDefinition.trim().length < 8) {
    errors.successDefinition = 'Tell us what success looks like for this website.';
  }

  return errors;
}

export function firstInvalidChapter(inquiry: BuildInquiry): { chapter: ChapterId; errors: ChapterErrors } | null {
  for (const chapter of getChapterSequence(inquiry)) {
    if (chapter === 'arrival' || chapter === 'review') {
      continue;
    }
    const errors = validateChapter(chapter, inquiry);
    if (Object.keys(errors).length > 0) {
      return { chapter, errors };
    }
  }
  return null;
}

export function formatInquiryPlainText(inquiry: BuildInquiry): string {
  const lines: string[] = [
    'Everburn Interactive website brief',
    '',
    `Looking for: ${labelFor(LOOKING_FOR_OPTIONS, inquiry.lookingFor)}`,
    `Main goal: ${labelFor(MAIN_GOAL_OPTIONS, inquiry.mainGoal)}${inquiry.goalOther ? ` (${inquiry.goalOther})` : ''}`,
    '',
    `Business / brand: ${inquiry.businessName}`,
    `Industry: ${inquiry.industry}`,
    `City / country: ${inquiry.cityCountry}`,
    `What they do: ${inquiry.businessDescription}`,
    `Has website: ${inquiry.hasWebsite === 'yes' ? 'Yes' : inquiry.hasWebsite === 'no' ? 'No' : 'Not answered'}`,
  ];

  if (inquiry.currentWebsiteUrl) {
    lines.push(`Current URL: ${inquiry.currentWebsiteUrl}`);
  }

  lines.push(
    '',
    `Includes: ${labelsFor(INCLUDE_OPTIONS, inquiry.includes)}${inquiry.includesOther ? ` (${inquiry.includesOther})` : ''}`,
    `Size: ${labelFor(SITE_SIZE_OPTIONS, inquiry.siteSize)}`,
  );

  if (needs3DChapter(inquiry)) {
    lines.push(
      '',
      `3D use: ${labelsFor(THREE_D_USE_OPTIONS, inquiry.threeDUse)}${inquiry.threeDUseOther ? ` (${inquiry.threeDUseOther})` : ''}`,
      `Has models: ${labelFor(HAS_MODELS_OPTIONS, inquiry.hasModels)}`,
      `3D actions: ${labelsFor(THREE_D_ACTION_OPTIONS, inquiry.threeDActions)}${inquiry.threeDActionsOther ? ` (${inquiry.threeDActionsOther})` : ''}`,
    );
  }

  lines.push(
    '',
    `Budget: ${labelFor(BUDGET_OPTIONS, inquiry.budget)}`,
    `Timeline: ${labelFor(TIMELINE_OPTIONS, inquiry.timeline)}`,
  );

  if (inquiry.launchEvent.trim()) {
    lines.push(`Event / launch date: ${inquiry.launchEvent.trim()}`);
  }

  lines.push(
    '',
    `Assets: ${labelsFor(ASSET_OPTIONS, inquiry.assets)}${inquiry.assetsOther ? ` (${inquiry.assetsOther})` : ''}`,
    `Content: ${labelFor(CONTENT_PROVISION_OPTIONS, inquiry.contentProvision)}`,
    `Visual style: ${labelFor(VISUAL_STYLE_OPTIONS, inquiry.visualStyle)}`,
  );

  if (inquiry.likedWebsites.trim()) {
    lines.push(`Sites they like: ${inquiry.likedWebsites.trim()}`);
  }

  lines.push(
    '',
    `Name: ${inquiry.contactName}`,
    `Email: ${inquiry.contactEmail}`,
    `Phone / WhatsApp: ${inquiry.contactPhone}`,
  );

  if (inquiry.companyRole.trim()) {
    lines.push(`Company / role: ${inquiry.companyRole.trim()}`);
  }

  lines.push(
    `Preferred contact: ${labelFor(CONTACT_METHOD_OPTIONS, inquiry.contactMethod)}`,
    `Best time: ${labelFor(CONTACT_TIME_OPTIONS, inquiry.contactTime)}`,
    '',
    `Success looks like: ${inquiry.successDefinition}`,
  );

  return lines.join('\n');
}

export function formatInquiryCompact(inquiry: BuildInquiry): string {
  return [
    `Website brief from ${inquiry.contactName.trim()}`,
    inquiry.businessName.trim(),
    `Need: ${labelFor(LOOKING_FOR_OPTIONS, inquiry.lookingFor)}`,
    `Goal: ${labelFor(MAIN_GOAL_OPTIONS, inquiry.mainGoal)}${inquiry.goalOther.trim() ? ` (${inquiry.goalOther.trim()})` : ''}`,
    `Budget: ${labelFor(BUDGET_OPTIONS, inquiry.budget)}`,
    `Timeline: ${labelFor(TIMELINE_OPTIONS, inquiry.timeline)}`,
    `Contact: ${inquiry.contactPhone.trim()} / ${inquiry.contactEmail.trim()}`,
    `Prefer: ${labelFor(CONTACT_METHOD_OPTIONS, inquiry.contactMethod)} (${labelFor(CONTACT_TIME_OPTIONS, inquiry.contactTime)})`,
    `Success: ${inquiry.successDefinition.trim()}`,
  ]
    .filter(Boolean)
    .join('\n');
}
