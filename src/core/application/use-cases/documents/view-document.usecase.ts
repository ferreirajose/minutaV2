import { Document } from "@/core/domain/entities/document";
import { DocumentRepository } from "@/core/domain/interfaces/repositories/document-repository";
import { DocumentService } from "@/core/domain/interfaces/services/document-service";

export interface ViewDocumentInput {
  documentId: string;
  includeContent?: boolean;
  includeMetadata?: boolean;
}

export interface ViewDocumentOutput {
  document: Document;
  content?: string;
  metadata?: Record<string, any>;
  url?: string;
}

export class ViewDocumentUseCase {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly documentService: DocumentService
  ) {}

  /**
   * Executes the document viewing use case
   * @param input The view parameters
   * @returns The document with requested data
   */
  async execute(input: ViewDocumentInput): Promise<ViewDocumentOutput> {
    const { documentId, includeContent = false, includeMetadata = true } = input;

    // Get the document from repository
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    const result: ViewDocumentOutput = { document };

    try {
      // Get document URL if available
      if (document.url) {
        result.url = document.url;
      } else {
        // If no URL is stored, try to get it from the service
        result.url = await this.documentService.getDocumentUrl(documentId);
      }

      // Include metadata if requested
      if (includeMetadata) {
        try {
          result.metadata = await this.documentService.getDocumentMetadata(documentId);
        } catch (error) {
          console.warn('Failed to fetch document metadata:', error);
          result.metadata = document.toJSON().metadata || {};
        }
      }

      // Include content if requested
      if (includeContent) {
        try {
          result.content = await this.documentService.extractText(documentId);
        } catch (error) {
          console.warn('Failed to extract document content:', error);
          throw new Error('Failed to extract document content');
        }
      }

      return result;
    } catch (error) {
      // If we have a URL but other operations failed, still return the URL
      if (result.url) {
        return result;
      }
      throw error;
    }
  }

  /**
   * Gets a secure URL for viewing the document
   * @param documentId The ID of the document
   * @param expiresInSeconds Optional expiration time in seconds
   */
  async getViewUrl(
    documentId: string,
    expiresInSeconds?: number
  ): Promise<string> {
    // In a real implementation, this would generate a time-limited URL
    // For now, we'll just return the document URL
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    if (document.url) {
      return document.url;
    }

    return this.documentService.getDocumentUrl(documentId);
  }
}
