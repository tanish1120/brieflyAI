import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
      return Response.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const newUser = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
    }).returning();

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser[0];

    return Response.json(userWithoutPassword);
  } catch (error) {
    console.error('Signup error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}