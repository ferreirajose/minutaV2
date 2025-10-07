import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, X } from 'lucide-react';

interface FileUploadProps {
  acceptedTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  acceptedTypes = ['.pdf', '.html', '.htm', '.txt'],
  maxFileSize = 10 * 1024 * 1024, // 10MB padrão
  multiple = true,
  onFilesSelected,
  disabled = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<number>(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, [disabled, acceptedTypes, maxFileSize, multiple]);

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
  }, [acceptedTypes, maxFileSize, multiple]);

  // Processar e validar arquivos
  const processFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;

    // Se não é múltiplo, pega apenas o primeiro arquivo
    const filesToProcess = multiple ? files : [files[0]];

    const validFiles: File[] = [];
    const errors: string[] = [];

    filesToProcess.forEach(file => {
      // Validar tipo
      const fileExtension = '.' + file.name.toLowerCase().split('.').pop();
      const isValidType = acceptedTypes.some(type => 
        type.toLowerCase() === fileExtension
      );

      if (!isValidType) {
        errors.push(`Tipo não permitido: ${file.name}`);
        return;
      }

      // Validar tamanho
      if (file.size > maxFileSize) {
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
  }, [acceptedTypes, maxFileSize, multiple, onFilesSelected]);

  // Remover arquivo da lista
  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Limpar todos os arquivos
  const clearAllFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  // Utilitários
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAcceptedTypesText = (): string => {
    return acceptedTypes.map(type => type.replace('.', '').toUpperCase()).join(', ');
  };

  const getTotalUploadingFiles = (): number => {
    return uploadingFiles;
  };

  return (
    <div className="w-full">
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
        className={`mb-4 transition-all duration-300 cursor-pointer ${
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
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Arquivos selecionados ({selectedFiles.length})</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFiles}
                disabled={disabled}
              >
                Limpar todos
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;