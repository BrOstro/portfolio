import { pgTable, serial, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";

/**
 * High-level docs that you RAG over (resume, case studies).
 */
export const documents = pgTable("documents", {
	id: serial("id").primaryKey(),
	slug: varchar("slug", { length: 160 }).notNull().unique(),
	title: varchar("title", { length: 200 }).notNull(),
	body: text("body").notNull(),
	type: varchar('type', { length: 40 }).default('generic'),
	weight: integer('weight').default(1),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Chunked content + embedding vectors for retrieval.
 * NOTE: the "embedding" column (vector(1536)) is added via a SQL migration
 * after enabling the pgvector extension (see steps below).
 */
export const embeddings = pgTable("embeddings", {
	id: serial("id").primaryKey(),
	documentId: integer("document_id").notNull(), // FK via SQL migration optional
	chunkIndex: integer("chunk_index").notNull(),
	content: text("content").notNull(),
	// embedding: vector(1536)  <-- added later via SQL migration
});
