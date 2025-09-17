ALTER TABLE embeddings
    ADD COLUMN IF NOT EXISTS embedding vector(1536);

ALTER TABLE embeddings DROP CONSTRAINT IF EXISTS embeddings_document_fk;

ALTER TABLE embeddings
    ADD CONSTRAINT embeddings_document_fk
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_embeddings_doc ON embeddings(document_id);
