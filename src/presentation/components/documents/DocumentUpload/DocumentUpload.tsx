import React, { useCallback, useRef, useState } from 'react';
import { Upload, FileText, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DocumentUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  isLoadingExisting?: boolean;
  className?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  accept = '.pdf,.html,.htm,.txt',
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB
  isLoadingExisting = false,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle file drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(Array.from(e.dataTransfer.files));
      }
    },
    [onUpload]
  );

  // Handle file selection via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      // Reset the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Process and validate files
  const processFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} is too large. Max size is ${maxSize / (1024 * 1024)}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      onUpload(validFiles);
    }
  };

  // Remove a file from the list
  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Trigger file input click
  const triggerFileInput = useCallback(() => {
    if (!isLoadingExisting) {
      fileInputRef.current?.click();
    }
  }, [isLoadingExisting]);

  // Handle upload button click
  const handleUploadButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isLoadingExisting) {
        triggerFileInput();
      }
    },
    [isLoadingExisting, triggerFileInput]
  );

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <Card
        className={`mb-8 transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-primary border-2 bg-primary/10 shadow-lg scale-[1.02]'
            : 'border-dashed border-2 hover:border-primary/50 hover:bg-muted/20'
        } ${isLoadingExisting ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={isLoadingExisting ? undefined : handleDragEnter}
        onDragLeave={isLoadingExisting ? undefined : handleDragLeave}
        onDragOver={isLoadingExisting ? undefined : handleDragOver}
        onDrop={isLoadingExisting ? undefined : handleDrop}
        onClick={!isDragging && !isLoadingExisting ? triggerFileInput : undefined}
      >
        <CardContent className="p-8 flex flex-col items-center">
          {isLoadingExisting ? (
            <>
              <div className="p-4 rounded-full mb-6 bg-blue-100">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
              </div>
              <h2 className="text-xl font-medium mb-2 text-blue-800">
                Carregando documentos...
              </h2>
              <p className="text-muted-foreground mb-6 text-center max-w-lg">
                Aguarde enquanto carregamos os documentos existentes
              </p>
            </>
          ) : (
            <>
              <div
                className={`p-4 rounded-full mb-6 transition-all duration-300 ${
                  isDragging ? 'bg-primary/20 scale-110' : 'bg-primary/10'
                }`}
              >
                {isDragging ? (
                  <Upload className="h-10 w-10 text-primary animate-bounce" />
                ) : (
                  <FileText className="h-10 w-10 text-primary" />
                )}
              </div>

              <h2
                className={`text-xl font-medium mb-2 transition-all duration-300 ${
                  isDragging ? 'text-primary scale-105' : ''
                }`}
              >
                {isDragging ? 'Solte os arquivos aqui!' : 'Arraste e solte os documentos aqui'}
              </h2>

              <p className="text-muted-foreground mb-6 text-center max-w-lg">
                {isDragging
                  ? 'Solte os arquivos para fazer o upload automático'
                  : 'Faça upload dos documentos do processo: petições, decisões, peças processuais etc.'}
              </p>

              {!isDragging && (
                <>
                  <Button
                    variant="outline"
                    className="flex items-center bg-transparent mb-4"
                    onClick={handleUploadButtonClick}
                    disabled={isLoadingExisting}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Selecionar Arquivos</span>
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Tipos aceitos:</strong> {accept}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Tamanho máximo:</strong> {formatFileSize(maxSize)} por arquivo
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                <span className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )} */}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
      />
    </div>
  );
};