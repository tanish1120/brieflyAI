'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteCardSkeleton } from '@/components/notes/NoteCardSkeleton';
import { SearchBar } from '@/components/notes/SearchBar';
import { Note } from '@/lib/types';
import { notesApi } from '@/lib/api';
import { Plus, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function DashboardContent() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await notesApi.getAll();
        setNotes(data);
        setFilteredNotes(data);
      } catch (error) {
        console.error('Failed to load notes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      setFilteredNotes(
        notes.filter(
          n => n.title.toLowerCase().includes(lower) || n.content.toLowerCase().includes(lower)
        )
      );
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Manage your notes and generate AI summaries.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search notes by title or content..."
            />
          </div>
          <Link href="/notes/new">
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </Link>
        </div>

        {/* Notes Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <NoteCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              {searchQuery ? 'No matching notes' : 'No notes yet'}
            </h3>
            <p className="mb-6 text-muted-foreground max-w-sm">
              {searchQuery
                ? 'Try a different search term or create a new note.'
                : 'Create your first note and start summarizing with AI.'}
            </p>
            <Link href="/notes/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Note
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}