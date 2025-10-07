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

  const handleFilesSelected = async (files: File[]) => {
    
    try {
      // Usando Promise.all() para processamento paralelo
      const docBase = await Promise.all(
        files.map(async (file: File, idx: number) => {
          // Simulando uma operação assíncrona
          // Aqui você pode fazer upload, processamento, etc.
          await new Promise(resolve => setTimeout(resolve, 100)); // simula delay
          
          return new DocumentBase(`documento_${idx}`, file, docType);
        })
      );

      // Processando cada documento e aguardando a atualização
      const updatePromises  = docBase.map((doc: DocumentBase) => {
        const documentUpdate = new DocumentUpdateBase(doc, documentGateway);
        return documentUpdate.update();
      });

      // Aguardando todas as atualizações serem concluídas
      await Promise.all(updatePromises);
      
      console.log('Todos os documentos processados:', docBase);

      // ✅ Aqui você pode fazer algo com os documentos atualizados
      docBase.forEach(doc => {
        if (doc.data) {
          console.log(`Documento ${doc.id} possui dados:`, doc.data);
          // Acesse as propriedades específicas do DataResponse:
          // doc.data.texto_processado, doc.data.metadados, etc.
        } else {
          console.log(`Documento ${doc.id} não possui dados (erro no processamento)`);
        }
      });

    } catch (error) {
      console.error('Erro ao processar arquivos:', error)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Documentos</h1>

      <FileUpload
        acceptedTypes={['.pdf', '.docx', '.txt']}
        maxFileSize={5 * 1024 * 1024} // 5MB
        multiple={true}
        onFilesSelected={handleFilesSelected}
      />
    </div>
  )
}