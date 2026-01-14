import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { notes, summaries } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { callOllama } from '@/lib/ollama';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { noteId, content, length, style } = await request.json();

    if (!noteId || !content) {
      return Response.json({ error: 'Note ID and content are required' }, { status: 400 });
    }

    // Check if note belongs to user
    const note = await db.select().from(notes).where(and(eq(notes.id, noteId), eq(notes.userId, session.user.id))).limit(1);

    if (note.length === 0) {
      return Response.json({ error: 'Note not found' }, { status: 404 });
    }

    // Rate limiting
    if (!checkRateLimit(session.user.id)) {
      return Response.json({ error: 'Daily limit exceeded' }, { status: 429 });
    }

    let prompt;
    let type;
    let summaryContent;

    if (length && style) {
      // Summary mode
      type = 'summary';
      const lengthMap = {
        short: 'brief',
        medium: 'moderate',
        long: 'detailed',
      };
      const styleMap = {
        bullet: 'bullet points',
        paragraph: 'paragraph form',
      };

      prompt = `Summarize the following note in ${lengthMap[length]} length using ${styleMap[style]}:

${content}

Summary:`;

      summaryContent = await callOllama(prompt);
    } else {
      // Keywords mode
      type = 'keywords';
      prompt = `Extract the most important keywords and key phrases from the following note. Return them as a bullet list:

${content}

Keywords:`;

      summaryContent = await callOllama(prompt);
    }

    // Save to DB
    const newSummary = await db.insert(summaries).values({
      noteId,
      type,
      content: summaryContent,
      length: type === 'summary' ? length : null,
      style: type === 'summary' ? style : null,
      modelName: 'phi3',
      prompt,
    }).returning();

    return Response.json(newSummary[0]);
  } catch (error) {
    console.error('Summarize error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}