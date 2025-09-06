import type { DocumentType } from "@/shared/types";
export interface DocumentProps {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  uploadProgress?: number;
  errorMessage?: string;
  isUploading: boolean;
  hasError: boolean;
  documentType: DocumentType;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
  total_paginas?: number;
  total_tokens?: number;
}

export class Document {
  private props: DocumentProps;

  constructor(props: DocumentProps) {
    this.props = {
      ...props,
      uploadProgress: props.uploadProgress || 0,
      status: props.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      total_paginas: props.total_paginas || 0,
      total_tokens: props.total_tokens || 0,
    };
  }

  // Getters
  get id(): string { return this.props.id; }
  get file(): File { return this.props.file; }
  get name(): string { return this.props.name; }
  get size(): number { return this.props.size; }
  get type(): string { return this.props.type; }
  get status(): string { return this.props.status; }
  get hasError(): boolean { return this.props.hasError; }
  get isUploading(): boolean { return this.props.isUploading; }
  get uploadProgress(): number { return this.props.uploadProgress || 0; }
  get errorMessage(): string | undefined { return this.props.errorMessage; }
  get url(): string | undefined { return this.props.url; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
  get totalPages(): number { return this.props.total_paginas || 0; }
  get totalTokens(): number { return this.props.total_tokens || 0; }
  get metadata(): Record<string, any> | undefined { return this.props.metadata; }
   // Setters para tipos específicos
  setDocumentType(type: DocumentType): void {
    this.props.documentType = type;
    this.props.updatedAt = new Date();
  }

  // Setters with validation
  updateProgress(progress: number): void {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }
    this.props.uploadProgress = progress;
    this.props.updatedAt = new Date();
  }

  markAsProcessing(): void {
    this.props.status = 'processing';
    this.props.updatedAt = new Date();
  }

  markAsCompleted(url: string, metadata?: {
    totalPages?: number;
    totalTokens?: number;
    [key: string]: any;
  }): void {
    this.props.status = 'completed';
    this.props.url = url;
    this.props.uploadProgress = 100;
    this.props.updatedAt = new Date();
    
    if (metadata) {
      this.props.total_paginas = metadata.totalPages || this.props.total_paginas;
      this.props.total_paginas = metadata.totalTokens || this.props.total_paginas;
      this.props.metadata = { ...(this.props.metadata || {}), ...metadata };
    }
  }

  markAsError(error: string): void {
    this.props.status = 'error';
    this.props.errorMessage = error;
    this.props.updatedAt = new Date();
  }

  toJSON(): DocumentProps {
    return { ...this.props };
  }

  // Métodos auxiliares para verificar o tipo
  isDocumento(): boolean {
    return this.props.documentType === 'documento';
  }

  isModelo(): boolean {
    return this.props.documentType === 'modelo';
  }

  isJurisprudencia(): boolean {
    return this.props.documentType === 'jurisprudencia';
  }

  static createFromFile(file: File, documentType: DocumentType): Document {
    return new Document({
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      documentType: documentType, 
      file,
      isUploading: true,
      uploadProgress: 0,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      hasError: false, // Adicionado do objeto B
      errorMessage: '', // Adicionado do objeto B
      url: '', // Adicionado do objeto B
      metadata: undefined, // Adicionado do objeto B
      total_paginas: 0, // Adicionado do objeto B
      total_tokens: 0 // Adicionado do objeto B
    });
  }
}
