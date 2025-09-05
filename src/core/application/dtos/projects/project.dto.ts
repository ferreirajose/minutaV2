import { BaseDTO } from "../base.dto";
import { DocumentDTO } from "../documents/document.dto";

export interface ProjectStatistics {
  /**
   * Total number of documents in the project
   */
  totalDocuments: number;
  
  /**
   * Total size of all documents in bytes
   */
  totalSize: number;
  
  /**
   * Total number of tokens across all documents
   */
  totalTokens: number;
  
  /**
   * Count of documents by type
   */
  documentsByType: Record<string, number>;
}

export class ProjectDTO extends BaseDTO {
  /**
   * The name of the project
   */
  name: string;

  /**
   * A description of the project (optional)
   */
  description?: string;

  /**
   * Project metadata (custom key-value pairs)
   */
  metadata?: Record<string, any>;

  /**
   * IDs of documents in this project
   */
  documentIds: string[] = [];
}

export class CreateProjectDTO {
  /**
   * The name of the project
   */
  name: string;

  /**
   * A description of the project (optional)
   */
  description?: string;

  /**
   * Initial metadata for the project (optional)
   */
  metadata?: Record<string, any>;
}

export class UpdateProjectDTO {
  /**
   * New name for the project (optional)
   */
  name?: string;

  /**
   * New description for the project (use null to remove)
   */
  description?: string | null;

  /**
   * Metadata to merge with existing metadata
   */
  metadata?: Record<string, any>;
}

export class ProjectResponseDTO extends ProjectDTO {
  /**
   * The documents in this project (if expanded)
   */
  documents?: DocumentDTO[];

  /**
   * Project statistics (if requested)
   */
  statistics?: ProjectStatistics;
}

export class ProjectListDTO {
  /**
   * List of projects
   */
  items: ProjectResponseDTO[];

  /**
   * Total number of projects
   */
  total: number;

  /**
   * Number of projects in this response
   */
  count: number;

  /**
   * Current page number (if paginated)
   */
  page?: number;

  /**
   * Number of items per page (if paginated)
   */
  pageSize?: number;
}
