// API service layer - Real backend implementation
// Connected to Next.js API routes

import { User, Note, Summary, SummaryLength, SummaryStyle, SummaryType, UsageStats } from './types';

const API_BASE = '/api';

// ============ AUTH API ============

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async signup(email: string, password: string, name: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw new Error('Signup failed');
    return res.json();
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  },

  async deleteAccount(): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/delete`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
  },

  async getCurrentUser(): Promise<User | null> {
    const res = await fetch(`${API_BASE}/auth/session`);
    if (res.ok) return res.json();
    return null;
  },
};

// ============ NOTES API ============

export const notesApi = {
  async getAll(): Promise<Note[]> {
    const res = await fetch(`${API_BASE}/notes`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },

  async getById(id: string): Promise<Note | null> {
    const res = await fetch(`${API_BASE}/notes/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch note');
    return res.json();
  },

  async create(title: string, content: string): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  },

  async update(id: string, title: string, content: string): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete note');
  },

  async search(query: string): Promise<Note[]> {
    const res = await fetch(`${API_BASE}/notes/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search notes');
    return res.json();
  },
};

// ============ SUMMARIZE API ============

export const summarizeApi = {
  async summarize(
    noteId: string,
    content: string,
    length: SummaryLength,
    style: SummaryStyle
  ): Promise<Summary> {
    const res = await fetch(`${API_BASE}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteId, content, length, style }),
    });
    if (!res.ok) throw new Error('Failed to summarize');
    return res.json();
  },

  async extractKeywords(noteId: string, content: string): Promise<Summary> {
    const res = await fetch(`${API_BASE}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteId, content }),
    });
    if (!res.ok) throw new Error('Failed to extract keywords');
    return res.json();
  },

  async getSummaries(noteId: string): Promise<Summary[]> {
    const res = await fetch(`${API_BASE}/summarize/${noteId}`);
    if (!res.ok) throw new Error('Failed to fetch summaries');
    return res.json();
  },
};

// ============ USAGE API ============

export const usageApi = {
  async getStats(): Promise<UsageStats> {
    const res = await fetch(`${API_BASE}/usage`);
    if (!res.ok) throw new Error('Failed to fetch usage stats');
    return res.json();
  },
};
