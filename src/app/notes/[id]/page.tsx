'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SummaryPanel } from '@/components/notes/SummaryPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { Note, Summary, SummaryLength, SummaryStyle } from '@/lib/types';
import { notesApi, summarizeApi } from '@/lib/api';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const NoteEditorContent = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const loadNote = async () => {
        try {
          const [noteData, summariesData] = await Promise.all([
            notesApi.getById(id),
            summarizeApi.getSummaries(id),
          ]);
          if (noteData) {
            setNote(noteData);
            setTitle(noteData.title);
            setContent(noteData.content);
            setSummaries(summariesData);
          } else {
            toast.error('Note not found');
            router.push('/dashboard');
          }
        } catch (error) {
          toast.error('Failed to load note');
          router.push('/dashboard');
        } finally {
          setIsLoading(false);
        }
      };
      loadNote();
    }
  }, [id, isNew, router]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSaving(true);
    try {
      if (isNew) {
        const newNote = await notesApi.create(title, content);
        toast.success('Note saved!');
        router.push(`/notes/${newNote.id}`);
      } else if (id) {
        await notesApi.update(id, title, content);
        toast.success('Note saved!');
        setHasChanges(false);
      }
    } catch (error) {
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSaving(true);
    try {
      await notesApi.create(title, content);
      toast.success('Note created!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to create note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await notesApi.delete(id);
      toast.success('Note deleted');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const handleSummarize = async (length: SummaryLength, style: SummaryStyle) => {
    if (!id || isNew) {
      toast.error('Save the note first to generate summaries');
      return;
    }

    setIsSummarizing(true);
    try {
      const summary = await summarizeApi.summarize(id, content, length, style);
      setSummaries([summary, ...summaries]);
      toast.success('Summary generated!');
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleExtractKeywords = async () => {
    if (!id || isNew) {
      toast.error('Save the note first to extract keywords');
      return;
    }

    setIsSummarizing(true);
    try {
      const keywords = await summarizeApi.extractKeywords(id, content);
      setSummaries([keywords, ...summaries]);
      toast.success('Keywords extracted!');
    } catch (error) {
      toast.error('Failed to extract keywords');
    } finally {
      setIsSummarizing(false);
    }
  };

  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            {!isNew && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 text-destructive-foreground hover:text-destructive-foreground">
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Note</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this note? This action cannot be undone.
                      All summaries associated with this note will also be deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {isNew ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving} variant="outline" className="gap-2">
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save
                </Button>
                <Button onClick={handleCreate} disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Create Note
                </Button>
              </div>
            ) : (
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
                {hasChanges && '*'}
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">
              {isNew ? 'Create New Note' : 'Edit Note'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isNew
                ? 'Write your note and save it for AI-powered summarization'
                : 'Edit your note and generate summaries or extract keywords'
              }
            </p>
          </div>

          {/* Editor */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Note title..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-lg font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Start typing or paste your notes here..."
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-[400px] resize-none font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground text-right">
                {content.length} characters
              </p>
            </div>
          </div>

          {/* Summary Panel - Only show for existing notes */}
          {!isNew && (
            <div className="w-full">
              <SummaryPanel
                noteContent={content}
                summaries={summaries}
                onSummarize={handleSummarize}
                onExtractKeywords={handleExtractKeywords}
                isLoading={isSummarizing}
              />
            </div>
          )}
        </div>
        </div>
        
    </Layout>
  );
}

export default function NoteEditorPage() {
  return (
    <ProtectedRoute>
      <NoteEditorContent />
    </ProtectedRoute>
  );
}