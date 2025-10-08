// SelectedFilesList.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DocumentItem } from './DocumentItem';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import DocumentBase from '@/domain/entity/DocumentBase';

interface SelectedFilesListProps {
  documents: DocumentBase[];
  uploadingFiles?: number;
  onRemoveDocument: (index: number) => void;
  onClearAll: () => void;
  onViewDocument?: (document: DocumentBase, index: number) => void;
  onRetryDocument?: (document: DocumentBase, index: number) => void;
  disabled?: boolean;
}

export function SelectedFilesList({
  documents,
  uploadingFiles = 0,
  onRemoveDocument,
  onClearAll,
  onViewDocument,
  onRetryDocument,
  disabled = false
}: SelectedFilesListProps) {

  const getDocumentStatus = (document: DocumentBase, index: number) => {
    const isUploading = uploadingFiles > 0;
    
    if (isUploading) {
      return {
        bgColor: 'bg-blue-50',
        color: 'text-blue-600',
        text: 'Processando...',
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        hasError: false
      };
    }

    // Verifica se o documento foi processado com sucesso
    if (document.data) {
      return {
        bgColor: 'bg-green-50',
        color: 'text-green-600',
        text: 'Processado com sucesso',
        icon: <FileText className="h-4 w-4" />,
        hasError: false
      };
    }

    // Se não tem dados e não está processando, considera como erro
    return {
      bgColor: 'bg-red-50',
      color: 'text-red-600',
      text: 'Error no processamento',
      icon: <AlertCircle className="h-4 w-4" />,
      hasError: true
    };
  };

  // Obter totalPages e totalTokens do DocumentBase
  const getDocumentInfo = (document: DocumentBase) => {
    console.log('Document data:', document);
    if (document.data) {
      const data = document.data;
      return {
        totalPages: data.total_paginas || 0,
        totalTokens: data.total_tokens || 0
      };
    }
    return { totalPages: 0, totalTokens: 0 };
  };

  if (documents.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Documentos selecionados ({documents.length})
            {uploadingFiles > 0 && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Processando {uploadingFiles} documento(s)...
              </span>
            )}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            disabled={disabled || uploadingFiles > 0}
          >
            Limpar todos
          </Button>
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {documents.map((document, index) => {
            const documentInfo = getDocumentInfo(document);
            const status = getDocumentStatus(document, index);
            
            return (
              <DocumentItem
                key={document.id}
                document={document}
                status={status}
                totalPages={documentInfo.totalPages}
                totalTokens={documentInfo.totalTokens}
                onDelete={() => onRemoveDocument(index)}
                onView={onViewDocument ? () => onViewDocument(document, index) : undefined}
                onRetry={status.hasError && onRetryDocument ? () => onRetryDocument(document, index) : undefined}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}