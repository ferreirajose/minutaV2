import { Project } from "../../entities/project";

export interface ProjectRepository {
  /**
   * Save a project
   * @param project The project to save
   */
  save(project: Project): Promise<void>;

  /**
   * Find a project by ID
   * @param id The project ID
   */
  findById(id: string): Promise<Project | null>;

  /**
   * Find a project by name (case-insensitive)
   * @param name The project name to search for
   */
  findByName(name: string): Promise<Project | null>;

  /**
   * Find all projects
   */
  findAll(): Promise<Project[]>;

  /**
   * Update a project
   * @param project The project to update
   */
  update(project: Project): Promise<void>;

  /**
   * Delete a project by ID
   * @param id The project ID to delete
   */
  delete(id: string): Promise<void>;

  /**
   * Check if a project with the given name exists
   * @param name The project name to check
   * @param excludeId Optional project ID to exclude from the check (for updates)
   */
  existsWithName(name: string, excludeId?: string): Promise<boolean>;

  /**
   * Add a document to a project
   * @param projectId The project ID
   * @param document The document to add
   */
  addDocument(projectId: string, document: Document): Promise<void>;

  /**
   * Remove a document from a project
   * @param projectId The project ID
   * @param documentId The document ID to remove
   */
  removeDocument(projectId: string, documentId: string): Promise<boolean>;

  /**
   * Update a document in a project
   * @param projectId The project ID
   * @param document The updated document
   */
  updateDocument(projectId: string, document: Document): Promise<boolean>;

  /**
   * Count all projects
   */
  count(): Promise<number>;
}
