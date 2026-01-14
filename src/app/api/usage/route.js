import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { summaries, notes } from '@/lib/db/schema';
import { eq, gte, lt, and, count } from 'drizzle-orm';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count summaries used today
    const summariesResult = await db
      .select({ count: count() })
      .from(summaries)
      .innerJoin(notes, eq(summaries.noteId, notes.id))
      .where(
        and(
          eq(notes.userId, session.user.id),
          eq(summaries.type, 'summary'),
          gte(summaries.createdAt, today),
          lt(summaries.createdAt, tomorrow)
        )
      );

    // Count keywords used today
    const keywordsResult = await db
      .select({ count: count() })
      .from(summaries)
      .innerJoin(notes, eq(summaries.noteId, notes.id))
      .where(
        and(
          eq(notes.userId, session.user.id),
          eq(summaries.type, 'keywords'),
          gte(summaries.createdAt, today),
          lt(summaries.createdAt, tomorrow)
        )
      );

    const usageStats = {
      summariesUsedToday: summariesResult[0]?.count || 0,
      maxSummariesPerDay: 10,
      keywordsUsedToday: keywordsResult[0]?.count || 0,
      maxKeywordsPerDay: 20,
    };

    return Response.json(usageStats);
  } catch (error) {
    console.error('Get usage error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}