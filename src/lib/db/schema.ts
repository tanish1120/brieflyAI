import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notes = pgTable('notes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const summaries = pgTable('summaries', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  noteId: text('note_id').notNull().references(() => notes.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // "summary" or "keywords"
  content: text('content').notNull(),
  length: text('length'), // "short", "medium", "long" for summaries
  style: text('style'), // "bullet", "paragraph" for summaries
  modelName: text('model_name').notNull(),
  prompt: text('prompt').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  summaries: many(summaries),
}));

export const summariesRelations = relations(summaries, ({ one }) => ({
  note: one(notes, {
    fields: [summaries.noteId],
    references: [notes.id],
  }),
}));