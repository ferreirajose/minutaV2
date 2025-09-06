import React, { useCallback } from 'react';
import { FileText, Trash2, Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { DocumentWithMetadata } from '@/shared/interface';

interface DocumentStatus {
  bgColor: string;
  color: string;
  icon: React.ReactNode;
  text: string;
}

interface DocumentListProps {
  documentos: DocumentWithMetadata[];
  onDelete: (document: DocumentWithMetadata) => void;
  onView: (document: DocumentWithMetadata) => void;
  onRetry?: (document: DocumentWithMetadata) => void;
  onClearAll?: () => void;
  isLoading?: boolean;
  showClearAll?: boolean;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documentos = [],
  onDelete,
  onView,
  onRetry,
  onClearAll,
  isLoading = false,
  showClearAll = true
}) => {
  const getDocumentStatus = useCallback((doc: DocumentWithMetadata): DocumentStatus => {
    if (doc.hasError) {
      return {
        bgColor: 'bg-red-50',
        color: 'text-red-600',
        icon: <RefreshCw className="h-4 w-4" />,
        text: 'Erro no upload',
      };
    }
    if (doc.isUploading) {
      return {
        bgColor: 'bg-blue-50',
        color: 'text-blue-600',
        icon: <RefreshCw className="h-4 w-4 animate-spin" />,
        text: 'Enviando...',
      };
    }
    if (doc) {
      return {
        bgColor: 'bg-green-50',
        color: 'text-green-600',
        icon: <FileText className="h-4 w-4" />,
        text: 'Processado',
      };
    }
    return {
      bgColor: 'bg-gray-50',
      color: 'text-gray-600',
      icon: <FileText className="h-4 w-4" />,
      text: 'Pendente',
    };
  }, []);

  const getFileTypeIcon = useCallback((doc: DocumentWithMetadata) => {
    const extension = doc.file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'txt':
        return <FileText className="h-6 w-6 text-gray-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-400" />;
    }
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Carregando documentos...</div>;
  }

  if (!documentos || documentos.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nenhum documento encontrado</div>;
  }

  console.log(documentos, 'documentos')
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Documentos ({documentos.length})</h2>
        {showClearAll && onClearAll && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center bg-transparent"
            onClick={onClearAll}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Limpar tudo</span>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {documentos.map((doc, idx) => {
          const status = getDocumentStatus(doc);
          return (
            <Card key={doc.id || idx} className={`transition-all duration-200 ${status.bgColor}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className="bg-white p-2 rounded mr-3 shadow-sm">
                      {getFileTypeIcon(doc)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {doc.name || doc.file?.name || 'Documento sem nome'}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                        {doc.file?.size && <span>{formatFileSize(doc.file.size)}</span>}
                        {doc.total_paginas && (
                          <span>• {doc.total_tokens} páginas</span>
                        )}
                        {doc.total_tokens && (
                          <span>• {doc.total_tokens.toLocaleString()} tokens</span>
                        )}
                      </div>
                      <div className={`text-sm mt-2 flex items-center gap-2 ${status.color}`}>
                        {status.icon}
                        <span>{status.text}</span>
                      </div>
                      {doc.hasError && doc.errorMessage && (
                        <div className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded">
                          {doc.errorMessage}
                        </div>
                      )}
                      {doc.isUploading && doc.uploadProgress !== undefined && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${doc.uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive ml-2"
                    onClick={() => onDelete(doc)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2 mt-4 ml-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(doc)}
                    disabled={!doc}
                    className="flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Expandir Visualização
                  </Button>
                  {doc.hasError && onRetry && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRetry(doc)}
                      className="flex items-center text-orange-600 hover:text-orange-700"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Tentar Novamente
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};