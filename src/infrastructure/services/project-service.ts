import { Project } from '@/core/domain/entities/project';
import { type ProjectService as IProjectService } from '@/core/domain/interfaces/services/project-service';
import { HttpClient } from '../http/http-client';

export class ProjectService implements IProjectService {
  constructor(private readonly httpClient: HttpClient) {}

  async createProject(name: string, description?: string): Promise<Project> {
    return this.httpClient.post<Project>('/projects', { name, description });
  }

  async getProject(projectId: string): Promise<Project> {
    return this.httpClient.get<Project>(`/projects/${projectId}`);
  }

  async updateProject(projectId: string, updates: { name?: string; description?: string }): Promise<Project> {
    return this.httpClient.put<Project>(`/projects/${projectId}`, updates);
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.httpClient.delete(`/projects/${projectId}`);
  }

  async listProjects(): Promise<Project[]> {
    return this.httpClient.get<Project[]>('/listar_projetos');
  }

}