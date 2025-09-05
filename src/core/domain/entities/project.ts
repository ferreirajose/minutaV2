import { Document } from "./document";

export interface ProjectProps {
  id: string;
  name: string;
  description?: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export class Project {
  private props: ProjectProps;

  constructor(props: Omit<ProjectProps, 'id' | 'createdAt' | 'updatedAt' | 'documents'> & { id?: string }) {
    this.props = {
      ...props,
      id: props.id || `prj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Getters
  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
  get documents(): ReadonlyArray<Document> { return [...this.props.documents]; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
  get metadata(): Record<string, any> | undefined { return this.props.metadata; }
  get totalDocuments(): number { return this.props.documents.length; }
  get totalSize(): number {
    return this.props.documents.reduce((total, doc) => total + doc.size, 0);
  }
  get totalTokens(): number {
    return this.props.documents.reduce((total, doc) => total + doc.totalTokens, 0);
  }

  // Setters with validation
  updateName(name: string): void {
    if (!name.trim()) {
      throw new Error('Project name cannot be empty');
    }
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }

  addDocument(document: Document): void {
    if (this.hasDocument(document.id)) {
      throw new Error(`Document with ID ${document.id} already exists in this project`);
    }
    this.props.documents.push(document);
    this.props.updatedAt = new Date();
  }

  removeDocument(documentId: string): boolean {
    const initialLength = this.props.documents.length;
    this.props.documents = this.props.documents.filter(doc => doc.id !== documentId);
    const removed = this.props.documents.length < initialLength;
    if (removed) {
      this.props.updatedAt = new Date();
    }
    return removed;
  }

  getDocument(documentId: string): Document | undefined {
    return this.props.documents.find(doc => doc.id === documentId);
  }

  hasDocument(documentId: string): boolean {
    return this.props.documents.some(doc => doc.id === documentId);
  }

  updateDocument(updatedDocument: Document): boolean {
    const index = this.props.documents.findIndex(doc => doc.id === updatedDocument.id);
    if (index === -1) return false;
    
    this.props.documents[index] = updatedDocument;
    this.props.updatedAt = new Date();
    return true;
  }

  toJSON(): ProjectProps {
    return {
      ...this.props,
      documents: this.props.documents.map(doc => doc.toJSON())
    };
  }

  static create(props: Omit<ProjectProps, 'id' | 'createdAt' | 'updatedAt' | 'documents'>): Project {
    return new Project({
      name: props.name,
      description: props.description,
      metadata: props.metadata,
    });
  }
}
