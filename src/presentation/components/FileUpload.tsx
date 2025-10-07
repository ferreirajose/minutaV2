import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';
import ManangerFile from '@/application/ManangerFile';
import { SelectedFilesList } from '@/components/common/SelectedFilesList';
import { formatFileSize } from '@/shared/utils';

interface FileUploadProps {
  acceptedTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  onFileView?: (file: File, index: number) => void;
  onFileRetry?: (file: File, index: number) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  acceptedTypes = ['.pdf', '.html', '.htm', '.txt'],
  maxFileSize = 10 * 1024 * 1024, // 10MB padrão
  multiple = true,
  onFilesSelected,
  onFileView,
  onFileRetry,
  disabled = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<number>(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Instância da classe DocumentList com os tipos aceitos
  const documentList = useMemo(() => {
    return new ManangerFile(acceptedTypes);
  }, [acceptedTypes]);

  // Handlers para Drag and Drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, [disabled]);

  // Handler para clique no botão
  const handleUploadButtonClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  // Handler para input file change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    
    // Reset input para permitir selecionar os mesmos arquivos novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Processar e validar arquivos usando DocumentList
  const processFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;

    // Se não é múltiplo, pega apenas o primeiro arquivo
    const filesToProcess = multiple ? files : [files[0]];

    const validFiles: File[] = [];
    const errors: string[] = [];

    filesToProcess.forEach(file => {
      // Validar tipo usando DocumentList
      const isValidType = documentList.validateFileType(file);

      if (!isValidType) {
        errors.push(`Tipo não permitido: ${file.name}`);
        return;
      }

      // Validar tamanho usando DocumentList
      const isValidSize = documentList.validateFileSize(file, maxFileSize);

      if (!isValidSize) {
        errors.push(`Arquivo muito grande: ${file.name} (${formatFileSize(file.size)})`);
        return;
      }

      validFiles.push(file);
    });

    // Mostrar erros (você pode substituir por um toast/notification)
    if (errors.length > 0) {
      alert('Erros encontrados:\n' + errors.join('\n'));
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      onFilesSelected?.(validFiles);
      
      // Simular upload
      setUploadingFiles(prev => prev + validFiles.length);
      setTimeout(() => {
        setUploadingFiles(prev => prev - validFiles.length);
      }, 2000);
    }
  }, [maxFileSize, multiple, onFilesSelected, documentList]);

  // Remover arquivo da lista
  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Limpar todos os arquivos
  const clearAllFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const getAcceptedTypesText = (): string => {
    return acceptedTypes.map(type => type.replace('.', '').toUpperCase()).join(', ');
  };

  const getTotalUploadingFiles = (): number => {
    return uploadingFiles;
  };

  return (
    <div className="w-full space-y-4">
      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Área de Drop com Drag/Drop */}
      <Card
        className={`transition-all duration-300 cursor-pointer ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : isDragOver
              ? "border-primary border-2 bg-primary/10 shadow-lg scale-[1.02]"
              : "border-dashed border-2 hover:border-primary/50 hover:bg-muted/20"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={!isDragOver && !disabled ? handleUploadButtonClick : undefined}
      >
        <CardContent className="p-8 flex flex-col items-center">
          <div
            className={`p-4 rounded-full mb-6 transition-all duration-300 ${
              isDragOver ? "bg-primary/20 scale-110" : "bg-primary/10"
            }`}
          >
            {isDragOver ? (
              <Upload className="h-10 w-10 text-primary animate-bounce" />
            ) : (
              <FileText className="h-10 w-10 text-primary" />
            )}
          </div>

          <h2
            className={`text-xl font-medium mb-2 transition-all duration-300 ${
              isDragOver ? "text-primary scale-105" : ""
            }`}
          >
            {isDragOver ? "Solte os arquivos aqui!" : "Arraste e solte os documentos aqui"}
          </h2>

          <p className="text-muted-foreground mb-6 text-center max-w-lg">
            {isDragOver
              ? "Solte os arquivos para fazer o upload automático"
              : "Faça upload dos documentos do processo: petições, decisões, peças processuais etc."}
          </p>

          {!isDragOver && (
            <>
              <Button
                variant="outline"
                className="flex items-center bg-transparent mb-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadButtonClick();
                }}
                disabled={disabled || getTotalUploadingFiles() > 0}
              >
                {getTotalUploadingFiles() > 0 ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Processando {getTotalUploadingFiles()} arquivo(s)...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Selecionar Arquivos</span>
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Tipos aceitos:</strong> {getAcceptedTypesText()}
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Tamanho máximo:</strong> <span data-testid="maxSize">{formatFileSize(maxFileSize)}</span> por arquivo
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Lista de arquivos selecionados */}
      <SelectedFilesList
        files={selectedFiles}
        uploadingFiles={uploadingFiles}
        onRemoveFile={removeFile}
        onClearAll={clearAllFiles}
        onViewFile={onFileView}
        onRetryFile={onFileRetry}
        disabled={disabled}
      />
    </div>
  );
};

export default FileUpload;