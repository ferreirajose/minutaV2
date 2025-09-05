import { Document } from "../../entities/document";

export interface UploadDocumentParams {
  file: File;
  onProgress?: (progress: number) => void;
  abortSignal?: AbortSignal;
  metadata?: Record<string, any>;
}

export interface UploadDocumentResult {
  document: Document;
  url: string;
  tokensUsed: number;
  metadata?: Record<string, any>;
}

export interface DocumentService {
  /**
   * Upload and process a document
   * @param params Upload parameters including the file and progress callback
   */
  uploadDocument(params: UploadDocumentParams): Promise<UploadDocumentResult>;

  /**
   * Delete a document
   * @param documentId The ID of the document to delete
   */
  deleteDocument(documentId: string): Promise<void>;

  /**
   * Get a document's content URL
   * @param documentId The ID of the document
   */
  getDocumentUrl(documentId: string): Promise<string>;

  /**
   * Get a list of all documents
   */
  listDocuments(): Promise<Document[]>;

  /**
   * Get a document by ID
   * @param documentId The ID of the document to retrieve
   */
  getDocument(documentId: string): Promise<Document | null>;

  /**
   * Get the total number of tokens used by all documents
   */
  getTotalTokensUsed(): Promise<number>;

  /**
   * Extract text from a document
   * @param documentId The ID of the document
   */
  extractText(documentId: string): Promise<string>;

  /**
   * Get document metadata
   * @param documentId The ID of the document
   */
  getDocumentMetadata(documentId: string): Promise<Record<string, any>>;

  /**
   * Update document metadata
   * @param documentId The ID of the document
   * @param metadata The metadata to update
   */
  updateDocumentMetadata(
    documentId: string, 
    metadata: Record<string, any>
  ): Promise<void>;
}
