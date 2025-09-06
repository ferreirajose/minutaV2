import { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

import { DocumentList, DocumentUpload } from '@/presentation/components/documents';
import { DocumentService } from '@/infrastructure/services/document-service';
import { HttpClient } from '@/infrastructure/http/http-client';
import type { DocumentWithMetadata } from '@/shared/interface';
import { Document } from '@/core/domain/entities/document';

const BASE_URL = import.meta.env.VITE_API_URL;
const AUTH_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN;

// Crie uma instância do HttpClient com a configuração necessária
const httpClient = new HttpClient({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    Authorization: `Bearer ${AUTH_TOKEN}`,
  }
});

// Crie uma instância do DocumentService com o HttpClient
const documentService = new DocumentService(httpClient);

export function DocumentosPage() {
  const [documents, setDocuments] = useState<DocumentWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  // Handle document deletion
  const handleDelete = useCallback(async (doc: DocumentWithMetadata) => {
    try {
      if (doc.id && !doc.id.startsWith('temp-')) {
        await documentService.deleteDocument(doc.id);
      }
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
    } catch (error) {
      console.error('Error deleting document:', error);
      // Mostrar mensagem de erro para o usuário
    }
  }, []);

  // Handle retry upload
  const handleRetry = useCallback(async (doc: DocumentWithMetadata) => {
    try {
      setDocuments(prev => prev.map(d => 
        d.id === doc.id ? { 
          ...d, 
          isUploading: true, 
          hasError: false, 
          errorMessage: undefined,
          status: 'pending' as const
        } : d
      ));

      const uploadedDoc = await documentService.uploadDocument({
        file: doc.file,
        onProgress: (progress) => {
          setDocuments(prev => prev.map(d => 
            d.id === doc.id ? { ...d, uploadProgress: progress } : d
          ));
        }
      });
      
      setDocuments(prev => prev.map(d => 
        d.id === doc.id ? { 
          ...d, 
          ...uploadedDoc.document, 
          isUploading: false, 
          hasError: false,
          uploadProgress: 100
        } : d
      ));
    } catch (error) {
      console.error('Error retrying upload:', error);
      setDocuments(prev => prev.map(d => 
        d.id === doc.id ? { 
          ...d, 
          hasError: true, 
          errorMessage: 'Falha ao fazer upload. Tente novamente.',
          isUploading: false,
          status: 'error' as const
        } : d
      ));
    }
  }, []);

  // Handle file upload
  const handleUpload = useCallback(async (files: File[]) => {
    const newDocuments: DocumentWithMetadata[] = files.map(file => 
        Document.createFromFile(file, 'documento').toJSON()
    )

    setDocuments(prev => [...prev, ...newDocuments]);
    setUploadingCount(prev => prev + files.length);

    // Process each file upload
    files.forEach(async (file, index) => {
      const tempId = newDocuments[index].id;
      
      try {
        const uploadedDoc = await documentService.uploadDocument({
          file,
          onProgress: (progress) => {
            setDocuments(prev => prev.map(d => 
              d.id === tempId ? { ...d, uploadProgress: progress } : d
            ));
          }
        });
        
        setDocuments(prev => prev.map(d => 
          d.id === tempId ? { 
            ...d, 
            ...uploadedDoc.document, 
            isUploading: false,
            uploadProgress: 100
          } : d
        ));
      } catch (error) {
        console.error('Error uploading file:', error);
        setDocuments(prev => prev.map(d => 
          d.id === tempId ? { 
            ...d, 
            hasError: true, 
            errorMessage: 'Falha no upload. Tente novamente.',
            isUploading: false,
            status: 'error' as const
          } : d
        ));
      } finally {
        setUploadingCount(prev => prev - 1);
      }
    });
  }, []); // ← Adicione a dependência

  // Clear all documents
  const handleClearAll = useCallback(async () => {
    const documentsToDelete = documents.filter(doc => !doc.isUploading && !doc.id?.startsWith('temp-'));
    
    try {
      setIsLoading(true);
      await Promise.all(
        documentsToDelete.map(doc => 
          doc.id ? documentService.deleteDocument(doc.id) : Promise.resolve()
        )
      );
      setDocuments(prev => prev.filter(doc => doc.isUploading || doc.id?.startsWith('temp-')));
    } catch (error) {
      console.error('Error clearing documents:', error);
    } finally {
      setIsLoading(false);
    }
  }, [documents]);

  // Handle document view
  const handleView = useCallback((doc: DocumentWithMetadata) => {
    // Implement document viewing logic
    console.log('Viewing document:', doc);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Documentos</h1>
        {isLoading && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processando...
          </div>
        )}
      </div>

      <DocumentUpload 
        onUpload={handleUpload} 
        className="mb-8"
        isLoadingExisting={isLoading}
      />

      <DocumentList
        documentos={documents} // Passando um objeto JSON
        onDelete={handleDelete}
        onView={handleView}
        onRetry={handleRetry}
        onClearAll={handleClearAll}
        isLoading={isLoading}
        showClearAll={documents.length > 0 && uploadingCount === 0}
      />
    </div>
  );
}