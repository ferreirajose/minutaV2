import { ResponseData } from "@/interface/documentos-base";
import { ConfigService, HttpClient } from "../api/HttpClient";

export class FileProcessor {
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

  async uploadAndProcess(file: File): Promise<ResponseData> {
    const url = `${this.configService.getApiUrl()}/upload_and_process`;
    const token = this.configService.getAuthToken();
    
    return await this.httpClient.post(url, { file }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async visualizeOriginalFile(fileId: string): Promise<{ blob: Blob; filename: string } | null> {
    const url = `${this.configService.getApiUrl()}/visualize_original_file/${fileId}`;
    const token = this.configService.getAuthToken();
    
    return await this.httpClient.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
