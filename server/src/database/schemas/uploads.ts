import { pgTable, uuid, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const uploads = pgTable('uploads', {
  id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
  originalUrl: text('original_url').notNull(),
  shortCode: varchar('short_code', { length: 10 }).unique().notNull(),
  clickCount: integer('click_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});