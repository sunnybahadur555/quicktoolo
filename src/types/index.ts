export type CategoryId = 'image' | 'pdf' | 'qr' | 'text' | 'developer';

export interface ToolCategory {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  color: string;
  badgeBg: string;
}

export interface HowToStep {
  step: number;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Tool {
  id: string;
  title: string;
  h1?: string;
  seoTitle?: string;
  seoDescription?: string;
  slug: string; // e.g. /qr-code-generator
  aliases?: string[];
  category: CategoryId;
  shortDesc: string;
  longDesc: string;
  iconName: string;
  popular?: boolean;
  featured?: boolean;
  keywords: string[];
  features: string[];
  howToSteps: HowToStep[];
  faq: FAQItem[];
  relatedToolIds: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
