export interface Expense {
  id: string;
  category: string;
  item: string;
  estimatedCost: number;
  actualCost: number;
  paid: number; // Amount paid so far
  notes?: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
}

export enum WeddingCategory {
  VENUE = 'Venue & Catering',
  ATTIRE = 'Attire & Beauty',
  FLOWERS = 'Flowers & Decor',
  PHOTO = 'Photography & Video',
  MUSIC = 'Music & Entertainment',
  STATIONERY = 'Stationery',
  GIFTS = 'Gifts & Favors',
  MISC = 'Miscellaneous'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}