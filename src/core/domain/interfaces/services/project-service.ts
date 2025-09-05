import { Project } from "../../entities/project";
import { Document } from "../../entities/document";

export interface CreateProjectParams {
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdateProjectParams {
  name?: string;
  description?: string | null;
  metadata?: Record<string, any>;
}

export interface AddDocumentToProjectParams {
  projectId: string;
  file: File;
  onProgress?: (progress: number) => void;
  abortSignal?: AbortSignal;
  metadata?: Record<string, any>;
}

export interface ProjectService {
  /**
   * Create a new project
   * @param params Project creation parameters
   */
  createProject(params: CreateProjectParams): Promise<Project>;

  /**
   * Update an existing project
   * @param projectId The ID of the project to update
   * @param params Update parameters
   */
  updateProject(
    projectId: string,
    params: UpdateProjectParams
  ): Promise<Project>;

  /**
   * Delete a project
   * @param projectId The ID of the project to delete
   * @param deleteDocuments Whether to also delete associated documents
   */
  deleteProject(projectId: string, deleteDocuments?: boolean): Promise<void>;

  /**
   * Get a project by ID
   * @param projectId The ID of the project to retrieve
   */
  getProject(projectId: string): Promise<Project | null>;

  /**
   * List all projects
   */
  listProjects(): Promise<Project[]>;

  /**
   * Add a document to a project
   * @param params Parameters for adding a document
   */
  addDocumentToProject(params: AddDocumentToProjectParams): Promise<Document>;

  /**
   * Remove a document from a project
   * @param projectId The ID of the project
   * @param documentId The ID of the document to remove
   * @param deleteDocument Whether to also delete the document
   */
  removeDocumentFromProject(
    projectId: string,
    documentId: string,
    deleteDocument?: boolean
  ): Promise<void>;

  /**
   * Get all documents in a project
   * @param projectId The ID of the project
   */
  getProjectDocuments(projectId: string): Promise<Document[]>;

  /**
   * Get project statistics
   * @param projectId The ID of the project
   */
  getProjectStats(projectId: string): Promise<{
    totalDocuments: number;
    totalSize: number;
    totalTokens: number;
    documentsByType: Record<string, number>;
  }>;

  /**
   * Search projects by name or description
   * @param query The search query
   */
  searchProjects(query: string): Promise<Project[]>;

  /**
   * Check if a project name is available
   * @param name The name to check
   * @param excludeProjectId Optional project ID to exclude from the check
   */
  isProjectNameAvailable(name: string, excludeProjectId?: string): Promise<boolean>;
}
