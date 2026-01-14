import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Note } from '@/lib/types';
import { FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const preview = note.content.slice(0, 150) + (note.content.length > 150 ? '...' : '');

  return (
    <Link href={`/notes/${note.id}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer group">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent group-hover:bg-primary/10 transition-colors">
              <FileText className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {note.title}
              </CardTitle>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{preview}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
