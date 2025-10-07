import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatFileSize } from '@/shared/utils';
import { Trash2, Eye, RefreshCw, FileText, File, FileImage } from 'lucide-react';

interface DocumentItemProps {
  document: File;
  status?: {
    bgColor: string;
    color: string;
    text: string;
    icon: React.ReactNode;
  };
  errorMessage?: string;
  onDelete?: (document: File) => void;
  onRetry?: (document: File) => void;
  onView?: (document: File) => void;
  totalPages?: number;
  totalTokens?: number;
  uploadProgress?: number;
}

export function DocumentItem({ 
  document, 
  status = {
    bgColor: 'bg-white',
    color: 'text-green-600',
    text: 'Upload concluído',
    icon: <FileText className="h-4 w-4" />
  },
  errorMessage,
  onDelete,
  onRetry,
  onView,
  totalPages,
  totalTokens,
  uploadProgress
}: DocumentItemProps) {

  const getFileTypeIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileImage className="h-6 w-6 text-green-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  console.log(document, 'document item');
  return (
    <Card className={`transition-all duration-200 ${status.bgColor}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            <div className="bg-white p-2 rounded mr-3 shadow-sm">
              {getFileTypeIcon(document)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">
                {document.name}
                {/* {status && (
                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    ATIVO
                  </span>
                )} */}
              </div>
              
              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                <span>{formatFileSize(document.size)}</span>
                {(totalPages || totalTokens) && (
                  <span>
                    • {totalPages} páginas • {totalTokens} tokens
                  </span>
                )}
              </div>
              
              {status && (
                <div className={`text-sm mt-2 flex items-center gap-2 ${status.color}`}>
                  {status.icon}
                  <span>{status.text}</span>
                </div>
              )}
              
              {errorMessage && (
                <div className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded">
                  {errorMessage}
                </div>
              )}
              
              {uploadProgress !== undefined && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive ml-2"
              onClick={() => onDelete(document)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2 mt-4 ml-10">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => onView(document)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Expandir Visualização
            </Button>
          )}
          
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRetry(document)}
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
}