import type { DocumentType } from "@/shared/types";
import { BaseDTO } from "../base.dto";

export interface DocumentMetadata {
  totalPages?: number;
  totalTokens?: number;
  category?: string; // Para documentos
  templateType?: string; // Para modelos
  court?: string; // Para jurisprudência
  caseNumber?: string; // Para jurisprudência
  [key: string]: any;
}

export class DocumentDTO extends BaseDTO {
  /**
   * The name of the document
   */
  name: string;

  /**
   * The size of the document in bytes
   */
  size: number;

  /**
   * The MIME type of the document
   */
  type: string;

  /**
   * The type of document (documento, modelo, jurisprudencia)
   */
  documentType: DocumentType

  /**
   * The current status of the document
   */
  status: 'pending' | 'processing' | 'completed' | 'error';

  /**
   * The upload progress (0-100)
   */
  uploadProgress?: number;

  /**
   * Error message if the document processing failed
   */
  errorMessage?: string;

  /**
   * URL to access the document
   */
  url?: string;

  /**
   * Document metadata
   */
  metadata?: DocumentMetadata;

  /**
   * ID of the project this document belongs to (if any)
   */
  projectId?: string;
}

export class CreateDocumentDTO {
  /**
   * The file to upload
   */
  file: File;

  /**
   * The type of document (documento, modelo, jurisprudencia)
   */
  documentType: DocumentType

  /**
   * ID of the project to associate with this document (optional)
   */
  projectId?: string;

  /**
   * Additional metadata for the document
   */
  metadata?: Record<string, any>;
}

export class UpdateDocumentDTO {
  /**
   * New name for the document (optional)
   */
  name?: string;

  /**
   * New document type (optional)
   */
  documentType: DocumentType

  /**
   * New metadata to merge with existing metadata
   */
  metadata?: Record<string, any>;

  /**
   * Category for documentos (optional)
   */
  category?: string;

  /**
   * Template type for modelos (optional)
   */
  templateType?: string;

  /**
   * Court for jurisprudencia (optional)
   */
  court?: string;

  /**
   * Case number for jurisprudencia (optional)
   */
  caseNumber?: string;
}

export class DocumentResponseDTO extends DocumentDTO {
  /**
   * The extracted text content of the document (if available)
   */
  content?: string;

  /**
   * The full metadata of the document
   */
  metadata: DocumentMetadata;

  /**
   * Helper methods to check document type
   */
  isDocumento(): boolean {
    return this.documentType === 'documento';
  }

  isModelo(): boolean {
    return this.documentType === 'modelo';
  }

  isJurisprudencia(): boolean {
    return this.documentType === 'jurisprudencia';
  }
}