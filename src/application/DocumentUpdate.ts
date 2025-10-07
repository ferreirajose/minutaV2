import DocumentBase from "@/domain/entity/DocumentBase";
import DocumentGateway from "@/gateways/DocumentGateway";
import { DataResponse, ResponseData } from "@/interface/documentos-base";

export default class DocumentUpdateBase {
    constructor(
        private documentBase: DocumentBase,
        private gateway?: DocumentGateway
    ) {
        
    }
     // Método para fazer upload e atualizar os dados
  async update(): Promise<ResponseData> {
    if (!this.gateway) {
      throw new Error("DocumentGateway não foi injetado");
    }

    const result = await this.gateway.uploadAndProcess(this.documentBase.file);
    
    if (result.success && result.data) {
        console.log('Upload e processamento bem-sucedidos:', result.data);
        this.documentBase.data = result.data as Partial<DataResponse>;
    } else {
        console.error('Erro no upload:', result.message);
    }
    
    return result;
  }

  
}