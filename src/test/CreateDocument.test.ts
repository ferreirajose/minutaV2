import { UploadServiceRepository } from '../infra/repository/UploadServiceRepository';
import { CreateDocument } from '../application/CreateDocument';
import { DocumentosBase, DocumentType } from './../domain/entity/Documentos';
// import type { DataResponse } from "@/interface/documentos-base";
import { createMockFile } from "./utils-test";
import  {DataResponse} from '@/interface/documentos-base';
import { UploadServiceMockRepository } from '@/infra/repository/UploadServiceMockRepository';
import { EnvironmentConfigService } from '@/infra/api/EnvironmentConfigService';
import { FileProcessor } from '@/infra/repository/FileProcessorRepository';
import { AxiosAdapter } from '@/infra/api/AxiosAdapter';


const file = createMockFile("test.txt", 1024, "text/plain");
const data: Partial<DataResponse> = { uuid_documento: "value" }; // Não precisa de todas as propriedades

const typeDoc = DocumentType.DOC;
//const doc = createMockDocumento("1", file, typeDoc, data);

describe("CreateDocument", () => {
  it("Deve criar um documento do tipo 'DOCUMENTO' utilizando o CreateDocumentFactory.execute e retorna a Instancia de DocumentosBase", async () => {

    const httpClient = new AxiosAdapter();

    const configService = new EnvironmentConfigService();
    const fileProcessor =  new FileProcessor(httpClient, configService);

    // 
    //const uploadAndProcessRepository = new UploadServiceRepository(fileProcessor);
    const uploadAndProcessRepository = new UploadServiceMockRepository(fileProcessor);
    const create = new CreateDocument(uploadAndProcessRepository);
    const doc = await create.execute("1", file, typeDoc, data);
    
    expect(doc).toBeInstanceOf(DocumentosBase);
 
  });

});
