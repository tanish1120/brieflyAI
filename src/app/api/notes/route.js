import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { notes } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userNotes = await db.select().from(notes).where(eq(notes.userId, session.user.id)).orderBy(desc(notes.updatedAt));

    return Response.json(userNotes);
  } catch (error) {
    console.error('Get notes error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return Response.json({ error: 'Title and content are required' }, { status: 400 });
    }

    if (content.length > 10000) {
      return Response.json({ error: 'Content too large' }, { status: 400 });
    }

    const newNote = await db.insert(notes).values({
      userId: session.user.id,
      title,
      content,
    }).returning();

    return Response.json(newNote[0]);
  } catch (error) {
    console.error('Create note error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}