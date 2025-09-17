-- 1) Optional: pgvector (no-op if already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2) Documents metadata
ALTER TABLE documents
    ADD COLUMN IF NOT EXISTS type varchar(40) DEFAULT 'generic';

ALTER TABLE documents
    ADD COLUMN IF NOT EXISTS weight integer DEFAULT 1;

-- 3) Full-text support on embeddings
ALTER TABLE embeddings
    ADD COLUMN IF NOT EXISTS fts tsvector;

CREATE INDEX IF NOT EXISTS idx_embeddings_fts
    ON embeddings USING GIN (fts);

-- 4) Uniqueness on (document_id, chunk_index) via UNIQUE INDEX (not a constraint)
CREATE UNIQUE INDEX IF NOT EXISTS uq_embeddings_doc_chunk
    ON embeddings(document_id, chunk_index);
