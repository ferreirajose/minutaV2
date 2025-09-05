import type { DocumentService } from "@/core/domain/interfaces/services/document-service";
import type { DocumentRepository } from "@/core/domain/interfaces/repositories/document-repository";
import { Document } from "@/core/domain/entities/document";

export interface UploadDocumentInput {
  file: File;
  projectId?: string;
  metadata?: Record<string, any>;
  onProgress?: (progress: number) => void;
  abortSignal?: AbortSignal;
}

export interface UploadDocumentOutput {
  document: Document;
  url: string;
  tokensUsed: number;
  metadata?: Record<string, any>;
}

export class UploadDocumentUseCase {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly documentService: DocumentService
  ) {}

  /**
   * Executes the document upload use case
   * @param input The upload parameters including the file and callbacks
   * @returns The upload result with document details
   */
  async execute(input: UploadDocumentInput): Promise<UploadDocumentOutput> {
    this.validateFile(input.file);

    // Create a new document entity
    const document = Document.createFromFile(input.file);
    
    try {
      // Save initial document state
      await this.documentRepository.save(document);
      
      // Upload the document using the service
      const result = await this.documentService.uploadDocument({
        file: input.file,
        onProgress: (progress) => {
          document.updateProgress(progress);
          input.onProgress?.(progress);
          // Update progress in repository
          this.documentRepository.update(document);
        },
        abortSignal: input.abortSignal,
        metadata: {
          ...input.metadata,
          projectId: input.projectId,
        },
      });

      // Update document with the result
      document.markAsCompleted(result.url, {
        totalPages: result.metadata?.totalPages,
        totalTokens: result.tokensUsed,
        ...result.metadata,
      });

      // Save the updated document
      await this.documentRepository.update(document);

      return {
        document,
        url: result.url,
        tokensUsed: result.tokensUsed,
        metadata: result.metadata,
      };
    } catch (error) {
      // Handle errors
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload document';
      document.markAsError(errorMessage);
      await this.documentRepository.update(document);
      throw error;
    }
  }

  /**
   * Validates the file before upload
   * @param file The file to validate
   * @throws Error if the file is invalid
   */
  private validateFile(file: File): void {
    if (!file) {
      throw new Error('No file provided');
    }

    // Maximum file size: 50MB
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Allowed file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported');
    }
  }
}
