// documentos-content.tsx
"use client"

import { useState } from 'react';
import DocumentBase, { DocumentType } from "@/domain/entity/DocumentBase";
import FileUpload from "../FileUpload"
import DocumentHttpGateway from "@/gateways/DocumentHttpGateway";
import AxiosAdapter from "@/infra/AxiosAdapter";
import DocumentUpdateBase from "@/application/DocumentUpdate";
import FetchAdapter from "@/infra/FetchAdapter";
import { SelectedFilesList } from "@/components/common/SelectedFilesList";

const BASE_URL = import.meta.env.VITE_API_URL_MINUTA;
const BASE_URL1 = import.meta.env.VITE_API_URL;
const AUTH_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN;

export function DocumentosContent() {
  const docType = DocumentType.DOC;
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentBase[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<number>(0);

  // Criando o FetchAdapter
  const httpClient = new FetchAdapter();

  // Criando o AxiosAdapter
  //const httpClient = new AxiosAdapter();
  const documentGateway = new DocumentHttpGateway(httpClient, BASE_URL1, AUTH_TOKEN);

  const handleDocumentsSelected = async (documents: DocumentBase[]) => {
    try {
      // Adiciona os novos documentos à lista
      setSelectedDocuments(prev => [...prev, ...documents]);
      
      // Inicia o contador de upload
      setUploadingFiles(prev => prev + documents.length);

      // Processando cada documento
      const updatePromises = documents.map(async (doc, index) => {
        try {
          const documentUpdate = new DocumentUpdateBase(doc, documentGateway);
          const result = await documentUpdate.update();

          console.log(`Documento ${doc.id} atualizado:`, doc.data);
          
          // Atualiza o documento na lista com os dados processados
          const globalIndex = selectedDocuments.length + index;
          setSelectedDocuments(prev => {
            const updated = [...prev];
            updated[globalIndex] = doc; // doc já foi atualizado pelo DocumentUpdateBase
            return updated;
          });

          return { doc, result, success: true };
        } catch (error) {
          console.error(`Erro ao processar documento ${doc.id}:`, error);
          return { doc, error, success: false };
        }
      });

      await Promise.all(updatePromises);
      console.log('Todos os documentos processados:', documents);

    } catch (error) {
      console.error('Erro ao processar arquivos:', error);
    } finally {
      // Finaliza o upload
      setUploadingFiles(prev => prev - documents.length);
    }
  }

  // Remover documento da lista
  const removeDocument = (index: number) => {
    setSelectedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Limpar todos os documentos
  const clearAllDocuments = () => {
    setSelectedDocuments([]);
  };

  // Visualizar documento
  const handleViewDocument = (document: DocumentBase, index: number) => {
    console.log('Visualizar documento:', document, index);
    // Implementar lógica de visualização aqui
  };

  // Tentar novamente o upload
  const handleRetryDocument = async (document: DocumentBase, index: number) => {
    try {
      setUploadingFiles(prev => prev + 1);
      
      const documentUpdate = new DocumentUpdateBase(document, documentGateway);
      const result = await documentUpdate.update();

      console.log(`Documento ${document.id} reprocessado:`, document.data);
      
      // Atualiza o documento na lista
      const updatedDocuments = [...selectedDocuments];
      updatedDocuments[index] = document;
      setSelectedDocuments(updatedDocuments);

    } catch (error) {
      console.error('Erro ao reprocessar documento:', error);
      // Mantém o documento na lista para permitir nova tentativa
    } finally {
      setUploadingFiles(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Documentos</h1>

      <FileUpload
        maxFileSize={10 * 1024 * 1024}
        multiple={true}
        onDocumentsSelected={handleDocumentsSelected}
        documentType={docType}
        uploadingFiles={uploadingFiles}
      />

      <SelectedFilesList
        documents={selectedDocuments}
        uploadingFiles={uploadingFiles}
        onRemoveDocument={removeDocument}
        onClearAll={clearAllDocuments}
        onViewDocument={handleViewDocument}
        onRetryDocument={handleRetryDocument}
      />
    </div>
  )
}