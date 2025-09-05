import type { Document } from '@/core/domain/entities/document';
import type { 
  DocumentService as IDocumentService, 
  UploadDocumentParams, 
  UploadDocumentResult 
} from '@/core/domain/interfaces/services/document-service';
import { HttpClient } from '../http/http-client';

export class DocumentService implements IDocumentService {
  constructor(private readonly httpClient: HttpClient) {}

  async uploadDocument(params: UploadDocumentParams): Promise<UploadDocumentResult> {
    const { file, onProgress, abortSignal, metadata } = params;
    const formData = new FormData();
    formData.append('uploaded_file', file);
    
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await this.httpClient.post<Document>('/upload_and_process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
      signal: abortSignal,
    });

    // Transform the response to match UploadDocumentResult
    return {
      document: response,
      url: `/documents/${response.id}`, // Adjust this based on your API response
      tokensUsed: 0, // Replace with actual tokens used from response if available
      metadata: response.metadata // Include any metadata from the response
    };
  }

  async getDocument(documentId: string): Promise<Document | null> {
    try {
      return await this.httpClient.get<Document>(`/documents/${documentId}`);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.httpClient.delete(`/documents/${documentId}`);
  }

  async listDocuments(): Promise<Document[]> {
    return this.httpClient.get<Document[]>('/documents');
  }

  async getDocumentUrl(documentId: string): Promise<string> {
    return `/api/documents/${documentId}/content`; // Adjust the URL pattern as needed
  }

  async getTotalTokensUsed(): Promise<number> {
    const documents = await this.listDocuments();
    return documents.reduce((total, doc) => total + (doc.tokens || 0), 0);
  }
}