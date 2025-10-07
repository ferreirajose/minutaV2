import { DataResponse, ResponseData } from "@/interface/documentos-base";
import DocumentGateway from "./DocumentGateway";
import HttpClient from "@/infra/HttpClient";

export default class DocumentHttpGateway implements DocumentGateway {
  constructor(
    readonly httpClient: HttpClient,
    readonly baseUrl: string,
    readonly token: string
  ) {}

  async uploadAndProcess(file: File): Promise<ResponseData> {

    try {
      const formData = new FormData();
      formData.append("uploaded_file", file);

      const response = await this.httpClient.post<DataResponse>(`${this.baseUrl}/upload_and_process/`, formData,
        {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${this.token}`,
            // Note: Não é necessário definir Content-Type para FormData,
            // o browser irá definir automaticamente com o boundary correto
          },
        }
      );

      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      console.error("Erro ao fazer upload do documento:", error);
      
      // Se for um erro do Axios, podemos acessar mais detalhes
      if (error.response) {
        return {
          success: false,
          message: `HTTP error! status: ${error.response.status}`,
          status: error.response.status,
        };
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }
}