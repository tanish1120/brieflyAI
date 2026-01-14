import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { notes } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return Response.json([]);
    }

    const searchNotes = await db.select().from(notes).where(
      sql`${notes.userId} = ${session.user.id} AND (${notes.title} ILIKE ${`%${query}%`} OR ${notes.content} ILIKE ${`%${query}%`})`
    ).orderBy(desc(notes.updatedAt));

    return Response.json(searchNotes);
  } catch (error) {
    console.error('Search notes error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}