import type { DocumentRepository } from "@/core/domain/interfaces/repositories/document-repository";
import type { DocumentService } from "@/core/domain/interfaces/services/document-service";

export interface DeleteDocumentInput {
  documentId: string;
  deleteFromStorage?: boolean;
}

export interface DeleteDocumentOutput {
  success: boolean;
  message?: string;
}

export class DeleteDocumentUseCase {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly documentService: DocumentService
  ) {}

  /**
   * Executes the document deletion use case
   * @param input The deletion parameters
   * @returns The deletion result
   */
  async execute(input: DeleteDocumentInput): Promise<DeleteDocumentOutput> {
    const { documentId, deleteFromStorage = true } = input;

    try {
      // Check if document exists
      const document = await this.documentRepository.findById(documentId);
      if (!document) {
        return {
          success: false,
          message: 'Document not found',
        };
      }

      // Delete from storage if requested
      if (deleteFromStorage) {
        await this.documentService.deleteDocument(documentId);
      }

      // Delete from repository
      await this.documentRepository.delete(documentId);

      return {
        success: true,
        message: 'Document deleted successfully',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete document';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}
