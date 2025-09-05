import { Document } from "../../entities/document";

export interface DocumentRepository {
  /**
   * Save a document
   * @param document The document to save
   */
  save(document: Document): Promise<void>;

  /**
   * Find a document by ID
   * @param id The document ID
   */
  findById(id: string): Promise<Document | null>;

  /**
   * Find all documents
   */
  findAll(): Promise<Document[]>;

  /**
   * Find documents by status
   * @param status The status to filter by
   */
  findByStatus(status: 'pending' | 'processing' | 'completed' | 'error'): Promise<Document[]>;

  /**
   * Update a document
   * @param document The document to update
   */
  update(document: Document): Promise<void>;

  /**
   * Delete a document by ID
   * @param id The document ID to delete
   */
  delete(id: string): Promise<void>;

  /**
   * Count all documents
   */
  count(): Promise<number>;

  /**
   * Count documents by status
   * @param status The status to count
   */
  countByStatus(status: 'pending' | 'processing' | 'completed' | 'error'): Promise<number>;
}
