import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { notes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const note = await db.select().from(notes).where(and(eq(notes.id, id), eq(notes.userId, session.user.id))).limit(1);

    if (note.length === 0) {
      return Response.json({ error: 'Note not found' }, { status: 404 });
    }

    return Response.json(note[0]);
  } catch (error) {
    console.error('Get note error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { title, content } = await request.json();

    if (!title || !content) {
      return Response.json({ error: 'Title and content are required' }, { status: 400 });
    }

    if (content.length > 10000) {
      return Response.json({ error: 'Content too large' }, { status: 400 });
    }

    // Check if note exists and belongs to user
    const existingNote = await db.select().from(notes).where(and(eq(notes.id, id), eq(notes.userId, session.user.id))).limit(1);

    if (existingNote.length === 0) {
      return Response.json({ error: 'Note not found' }, { status: 404 });
    }

    const updatedNote = await db.update(notes).set({ title, content }).where(eq(notes.id, id)).returning();

    return Response.json(updatedNote[0]);
  } catch (error) {
    console.error('Update note error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if note exists and belongs to user
    const note = await db.select().from(notes).where(and(eq(notes.id, id), eq(notes.userId, session.user.id))).limit(1);

    if (note.length === 0) {
      return Response.json({ error: 'Note not found' }, { status: 404 });
    }

    await db.delete(notes).where(eq(notes.id, id));

    return Response.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}