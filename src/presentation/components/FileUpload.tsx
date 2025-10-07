// FileUpload.tsx
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';
import ManangerFile from '@/application/ManangerFile';
import { SelectedFilesList } from '@/components/common/SelectedFilesList';
import { formatFileSize } from '@/shared/utils';
import DocumentBase, { DocumentType } from '@/domain/entity/DocumentBase';

interface FileUploadProps {
  acceptedTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
  onDocumentsSelected?: (documents: DocumentBase[]) => void;
  onDocumentView?: (document: DocumentBase, index: number) => void;
  onDocumentRetry?: (document: DocumentBase, index: number) => void;
  disabled?: boolean;
  documentType?: DocumentType;
}

const FileUpload: React.FC<FileUploadProps> = ({
  acceptedTypes = ['.pdf', '.html', '.htm', '.txt'],
  maxFileSize = 10 * 1024 * 1024,
  multiple = true,
  onDocumentsSelected,
  onDocumentView, // @IMPLEMENTA ESSA FUNÇÃO
  onDocumentRetry,
  disabled = false,
  documentType = DocumentType.DOC
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<number>(0);
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentBase[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleUploadButtonClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    // Reset input para permitir selecionar os mesmos arquivos novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Processar arquivos e criar DocumentBase
  const processFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;

    const filesToProcess = multiple ? files : [files[0]];

    const validDocuments: DocumentBase[] = [];
    const errors: string[] = [];

    filesToProcess.forEach((file, index) => {
      const isValidType = documentList.validateFileType(file);
      if (!isValidType) {
        errors.push(`Tipo não permitido: ${file.name}`);
        return;
      }

      const isValidSize = documentList.validateFileSize(file, maxFileSize);
      if (!isValidSize) {
        errors.push(`Arquivo muito grande: ${file.name} (${formatFileSize(file.size)})`);
        return;
      }

      // Criar DocumentBase para cada arquivo válido
      const document = new DocumentBase(
        `documento_${Date.now()}_${index}`,
        file,
        documentType,
        null
      );
      validDocuments.push(document);
    });

    if (errors.length > 0) {
      alert('Erros encontrados:\n' + errors.join('\n'));
    }

    if (validDocuments.length > 0) {
      setSelectedDocuments(prev => [...prev, ...validDocuments]);
      
      // Chamar callback
      onDocumentsSelected?.(validDocuments);
      
      // Simular upload
      setUploadingFiles(prev => prev + validDocuments.length);
      setTimeout(() => {
        setUploadingFiles(prev => prev - validDocuments.length);
      }, 2000);
    }
  }, [maxFileSize, multiple, onDocumentsSelected, documentList, documentType]);

  // Remover documento da lista
  const removeDocument = useCallback((index: number) => {
    setSelectedDocuments(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Limpar todos os documentos
  const clearAllDocuments = useCallback(() => {
    setSelectedDocuments([]);
  }, []);

  const getAcceptedTypesText = (): string => {
    return acceptedTypes.map(type => type.replace('.', '').toUpperCase()).join(', ');
  };

  const getTotalUploadingFiles = (): number => {
    return uploadingFiles;
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Área de Drop */}
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

      {/* Lista de documentos selecionados */}
      <SelectedFilesList
        documents={selectedDocuments}
        uploadingFiles={uploadingFiles}
        onRemoveDocument={removeDocument}
        onClearAll={clearAllDocuments}
        onViewDocument={onDocumentView}
        onRetryDocument={onDocumentRetry}
        disabled={disabled}
      />
    </div>
  );
};

export default FileUpload;