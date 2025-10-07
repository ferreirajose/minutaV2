"use client"

import DocumentBase, { DocumentType } from "@/domain/entity/DocumentBase";
import FileUpload from "../FileUpload"
import DocumentHttpGateway from "@/gateways/DocumentHttpGateway";
import AxiosAdapter from "@/infra/AxiosAdapter";
import DocumentUpdateBase from "@/application/DocumentUpdate";
import FetchAdapter from "@/infra/FetchAdapter";

const BASE_URL = import.meta.env.VITE_API_URL_MINUTA;
const BASE_URL1 = import.meta.env.VITE_API_URL;

const AUTH_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN;

export function DocumentosContent() {
  const docType = DocumentType.DOC;

  // Criando o FetchAdapter
  const httpClient = new FetchAdapter();

  // Criando o AxiosAdapter
  //const httpClient = new AxiosAdapter();
  const documentGateway = new DocumentHttpGateway(httpClient, BASE_URL1, AUTH_TOKEN);

  const handleDocumentsSelected = async (documents: DocumentBase[]) => {
    try {
      // Agora você recebe DocumentBase diretamente do FileUpload
      const docBase = documents;

      // Processando cada documento
      const updatePromises = docBase.map(async (doc) => {
        const documentUpdate = new DocumentUpdateBase(doc, documentGateway);
        const result = await documentUpdate.update();

        console.log(`Documento ${doc.id} atualizado:`, doc.data);
        return { doc, result };
      });

      await Promise.all(updatePromises);
      console.log('Todos os documentos processados:', docBase);

    } catch (error) {
      console.error('Erro ao processar arquivos:', error);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Documentos</h1>

      <FileUpload
        acceptedTypes={['.pdf', '.docx', '.txt']}
        maxFileSize={5 * 1024 * 1024}
        multiple={true}
        onDocumentsSelected={handleDocumentsSelected}
        documentType={docType}
      />
    </div>
  )
}