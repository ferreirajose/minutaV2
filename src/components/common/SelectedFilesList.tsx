import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DocumentItem } from './DocumentItem';
import { FileText, Loader2 } from 'lucide-react';

interface SelectedFilesListProps {
  files: File[];
  uploadingFiles?: number;
  onRemoveFile: (index: number) => void;
  onClearAll: () => void;
  onViewFile?: (file: File, index: number) => void;
  onRetryFile?: (file: File, index: number) => void;
  disabled?: boolean;
}

export function SelectedFilesList({
  files,
  uploadingFiles = 0,
  onRemoveFile,
  onClearAll,
  onViewFile,
  onRetryFile,
  disabled = false
}: SelectedFilesListProps) {

  const getFileStatus = (file: File, index: number) => {
    const isUploading = uploadingFiles > 0;
    
    if (isUploading) {
      return {
        bgColor: 'bg-blue-50',
        color: 'text-blue-600',
        text: 'Processando...',
        icon: <Loader2 className="h-4 w-4 animate-spin" />
      };
    }

    return {
      bgColor: 'bg-white',
      color: 'text-green-600',
      text: 'Processado com sucesso',
      icon: <FileText className="h-4 w-4" />
    };
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Arquivos selecionados ({files.length})
            {uploadingFiles > 0 && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Processando {uploadingFiles} arquivo(s)...
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
          {files.map((file, index) => (
            <DocumentItem
              key={`${file.name}-${index}-${file.lastModified}`}
              document={file}
              status={getFileStatus(file, index)}
              onDelete={() => onRemoveFile(index)}
              onView={onViewFile ? () => onViewFile(file, index) : undefined}
              onRetry={onRetryFile ? () => onRetryFile(file, index) : undefined}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}