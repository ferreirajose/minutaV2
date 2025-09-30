import type { ResponseData, DataResponse } from './../interface/documentos-base';

export class ProjectService {
  
  private static readonly BASE_URL = process.env.VITE_API_URL_MINUTA;
    private static readonly BASE_URL1 = process.env.VITE_API_URL;

  private static readonly AUTH_TOKEN = process.env.VITE_API_AUTH_TOKEN;

  // Instancia Singleton 
  private static instance: ProjectService;

  private constructor() {}

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  // Upload de arquivos para geração de minutas
  static async uploadAndProcess(file: File): Promise<ResponseData> {
    try {
      const formData = new FormData()
      formData.append("uploaded_file", file)

      const response = await fetch(`${this.BASE_URL1}/upload_and_process/`, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${this.AUTH_TOKEN}`,
        },
        body: formData,
      })
  
      if (!response.ok) {
        // Retorne explicitamente success: false com mensagem de erro
        return {
          success: false,
          message: `HTTP error! status: ${response.status}`,
          status: response.status
        }
      }
  
      const data: DataResponse = await response.json()
  
      return {
        success: true,
        data: data,
      }
    } catch (error) {
      console.error("Erro ao fazer upload do documento:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido",
      }
    }
  }

  static async viewOriginalFile(fileId: string): Promise<{ blob: Blob; filename: string } | null> {
    try {
      const response = await fetch(
        `${ProjectService.BASE_URL1}/visualize_original_file/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${ProjectService.AUTH_TOKEN}`,
          }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Arquivo não encontrado
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Obter o blob do PDF
      const blob = await response.blob();
      
      // Extrair o nome do arquivo do header Content-Disposition
      let filename = `documento-${fileId}.pdf`;
      const contentDisposition = response.headers.get('Content-Disposition');
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      return {
        blob,
        filename
      };

    } catch (error) {
      console.error('Error fetching original file:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const projectService = ProjectService.getInstance();