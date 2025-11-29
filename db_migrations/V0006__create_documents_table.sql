-- Create documents table for storing PDF files
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    doc_type VARCHAR(50) NOT NULL,
    file_data BYTEA NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_doc_type UNIQUE (doc_type, uploaded_at)
);

-- Create index for faster document lookups
CREATE INDEX IF NOT EXISTS idx_documents_doc_type ON documents(doc_type, uploaded_at DESC);
