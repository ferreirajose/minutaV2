import type { DocumentosRepository } from '../domain/repository/DocumentosRepository';
import type { DataResponse, ResponseData } from './../interface/documentos-base';
//import type { DataResponse } from '../interface/documentos-base';
// import { MOCK_DATA_RESPONSE_GENERIC } from '../mock/index';
import { DocumentosBase, DocumentType } from "../domain/entity/Documentos";

export class CreateDocument {
  
  constructor(readonly uploadAndProcessRepository: DocumentosRepository) {}

  async execute(id: string, file: File, type: DocumentType, data: Partial<DataResponse>) {
    const doc = new DocumentosBase(id, file, type, data);
    const dataResponse = await this.uploadAndProcessRepository.uploadAndProcess(file);
    return this.updateDocumentosBase(doc, dataResponse);
  } 

  private updateDocumentosBase(doc: DocumentosBase, dataResponse: ResponseData): DocumentosBase {
    const updateDoc = new DocumentosBase(doc.id, doc.file, doc.type, {
      ...doc.data,
      ...dataResponse.data
    });

    return updateDoc;
  }
}