// Types for BrieflyAI application

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SummaryLength = 'short' | 'medium' | 'long';
export type SummaryStyle = 'bullet' | 'paragraph';
export type SummaryType = 'summary' | 'keywords';

export interface Summary {
  id: string;
  noteId: string;
  type: SummaryType;
  content: string;
  length?: SummaryLength;
  style?: SummaryStyle;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UsageStats {
  summariesUsedToday: number;
  maxSummariesPerDay: number;
  keywordsUsedToday: number;
  maxKeywordsPerDay: number;
}
