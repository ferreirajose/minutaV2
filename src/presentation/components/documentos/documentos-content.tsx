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
import { DocumentViewerModal } from '../document-view/DocumentViewerModal';

const BASE_URL = import.meta.env.VITE_API_URL_MINUTA;
const BASE_URL1 = import.meta.env.VITE_API_URL;
const AUTH_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN;

export function DocumentosContent() {
  const docType = DocumentType.DOC;
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentBase[]>([]);
  const [processingDocuments, setProcessingDocuments] = useState<Set<string>>(new Set());
  const [selectedDocument, setSelectedDocument] = useState<DocumentBase | null>(null)

  // Criando o FetchAdapter
  const httpClient = new FetchAdapter();

  // Criando o AxiosAdapter
  //const httpClient = new AxiosAdapter();
  const documentGateway = new DocumentHttpGateway(httpClient, BASE_URL1, AUTH_TOKEN);

  const handleDocumentsSelected = async (documents: DocumentBase[]) => {
    try {
      // Adiciona os novos documentos à lista
      setSelectedDocuments(prev => [...prev, ...documents]);
      
      // Marca todos os novos documentos como processando
      setProcessingDocuments(prev => {
        const newSet = new Set(prev);
        documents.forEach(doc => newSet.add(doc.id));
        return newSet;
      });

      // Processando cada documento
      const updatePromises = documents.map(async (doc) => {
        try {
          const documentUpdate = new DocumentUpdateBase(doc, documentGateway);
          const result = await documentUpdate.update();

          console.log(`Documento ${doc.id} atualizado:`, doc.data);
          
          return { doc, result, success: true };
        } catch (error) {
          console.error(`Erro ao processar documento ${doc.id}:`, error);
          return { doc, error, success: false };
        } finally {
          // Remove o documento do conjunto de processamento
          setProcessingDocuments(prev => {
            const newSet = new Set(prev);
            newSet.delete(doc.id);
            return newSet;
          });
        }
      });

      await Promise.all(updatePromises);
      console.log('Todos os documentos processados:', documents);

    } catch (error) {
      console.error('Erro ao processar arquivos:', error);
      // Remove todos os documentos do conjunto de processamento em caso de erro geral
      setProcessingDocuments(prev => {
        const newSet = new Set(prev);
        documents.forEach(doc => newSet.delete(doc.id));
        return newSet;
      });
    }
  }

  // Remover documento da lista
  const removeDocument = (index: number) => {
    setSelectedDocuments(prev => {
      const documentToRemove = prev[index];
      const newDocuments = prev.filter((_, i) => i !== index);
      
      // Remove também do conjunto de processamento se estiver lá
      if (documentToRemove) {
        setProcessingDocuments(prevSet => {
          const newSet = new Set(prevSet);
          newSet.delete(documentToRemove.id);
          return newSet;
        });
      }
      
      return newDocuments;
    });
  };

  // Limpar todos os documentos
  const clearAllDocuments = () => {
    setSelectedDocuments([]);
    setProcessingDocuments(new Set());
  };

  // Visualizar documento
  const handleViewDocument = (document: DocumentBase, index: number) => {
    console.log('Visualizar documento:', document, index);
    setSelectedDocument(document)
  };

  // Fechar visualizador
  const closeDocumentViewer = () => {
    setSelectedDocument(null)
  };

  // Tentar novamente o upload
  const handleRetryDocument = async (document: DocumentBase, index: number) => {
    try {
      // Marca apenas este documento como processando
      setProcessingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.add(document.id);
        return newSet;
      });
      
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
      // Remove apenas este documento do conjunto de processamento
      setProcessingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(document.id);
        return newSet;
      });
    }
  };

  // Contador de documentos em processamento (apenas para exibição)
  const uploadingFiles = processingDocuments.size;

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
        processingDocuments={processingDocuments}
        onRemoveDocument={removeDocument}
        onClearAll={clearAllDocuments}
        onViewDocument={handleViewDocument}
        onRetryDocument={handleRetryDocument}
      />

      {/* Modal de visualização */}
      {selectedDocument && (
        <DocumentViewerModal
          document={selectedDocument}
          onClose={closeDocumentViewer}
        />
      )}

    </div>
  )
}