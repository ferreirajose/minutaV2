export interface DocumentProps {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  uploadProgress?: number;
  errorMessage?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
  totalPages?: number;
  totalTokens?: number;
}

export class Document {
  private props: DocumentProps;

  constructor(props: Omit<DocumentProps, 'createdAt' | 'updatedAt'>) {
    this.props = {
      ...props,
      uploadProgress: props.uploadProgress || 0,
      status: props.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalPages: props.totalPages || 0,
      totalTokens: props.totalTokens || 0,
    };
  }

  // Getters
  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get size(): number { return this.props.size; }
  get type(): string { return this.props.type; }
  get status(): string { return this.props.status; }
  get uploadProgress(): number { return this.props.uploadProgress || 0; }
  get errorMessage(): string | undefined { return this.props.errorMessage; }
  get url(): string | undefined { return this.props.url; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
  get totalPages(): number { return this.props.totalPages || 0; }
  get totalTokens(): number { return this.props.totalTokens || 0; }
  get metadata(): Record<string, any> | undefined { return this.props.metadata; }

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
      this.props.totalPages = metadata.totalPages || this.props.totalPages;
      this.props.totalTokens = metadata.totalTokens || this.props.totalTokens;
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

  static createFromFile(file: File): Document {
    return new Document({
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      uploadProgress: 0,
    });
  }
}
