import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { notes, summaries } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { noteId } = params;

    // Check if note belongs to user
    const note = await db.select().from(notes).where(and(eq(notes.id, noteId), eq(notes.userId, session.user.id))).limit(1);

    if (note.length === 0) {
      return Response.json({ error: 'Note not found' }, { status: 404 });
    }

    const noteSummaries = await db.select().from(summaries).where(eq(summaries.noteId, noteId)).orderBy(desc(summaries.createdAt));

    return Response.json(noteSummaries);
  } catch (error) {
    console.error('Get summaries error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}