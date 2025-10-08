// DocumentViewerModal.tsx
"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Loader2, AlertCircle } from "lucide-react"
import DocumentBase from "@/domain/entity/DocumentBase"
import { useState, useEffect } from 'react'

// Interface para os visualizadores de documento
interface DocumentViewer {
  canHandle(document: DocumentBase): boolean
  render(document: DocumentBase, url: string): React.ReactNode
}

// Visualizador para PDF
class PdfViewer implements DocumentViewer {
  canHandle(document: DocumentBase): boolean {
    return document.file.type === 'application/pdf' || 
           document.file.name.toLowerCase().endsWith('.pdf')
  }

  render(document: DocumentBase, url: string): React.ReactNode {
    return (
      <iframe
        src={url}
        className="w-full h-full border-0"
        title={`Visualização do documento ${document.file.name}`}
      />
    )
  }
}

// Visualizador para documentos de texto
class TextViewer implements DocumentViewer {
  private textExtensions = ['.txt', '.doc', '.docx', '.rtf']
  
  canHandle(document: DocumentBase): boolean {
    const extension = document.file.name.toLowerCase()
    return this.textExtensions.some(ext => extension.endsWith(ext)) ||
           document.file.type.startsWith('text/')
  }

  render(document: DocumentBase, url: string): React.ReactNode {
    return (
      <div className="w-full h-full p-4 bg-white overflow-auto">
        <pre className="whitespace-pre-wrap font-sans text-sm">
          {/* Aqui você pode implementar a lógica para exibir o conteúdo do texto */}
          Documento de texto: {document.file.name}
        </pre>
      </div>
    )
  }
}

// Visualizador para imagens
class ImageViewer implements DocumentViewer {
  private imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  
  canHandle(document: DocumentBase): boolean {
    const extension = document.file.name.toLowerCase()
    return this.imageExtensions.some(ext => extension.endsWith(ext)) ||
           document.file.type.startsWith('image/')
  }

  render(document: DocumentBase, url: string): React.ReactNode {
    return (
      <div className="flex items-center justify-center w-full h-full p-4 bg-white">
        <img
          src={url}
          alt={`Visualização da imagem ${document.file.name}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    )
  }
}

// Visualizador padrão (fallback)
class DefaultViewer implements DocumentViewer {
  canHandle(document: DocumentBase): boolean {
    return true // Sempre pode lidar, como fallback
  }

  render(document: DocumentBase, url: string): React.ReactNode {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Visualização não disponível</h3>
          <p className="text-muted-foreground mb-4">
            Faça o download do arquivo para visualizar o conteúdo
          </p>
        </div>
      </div>
    )
  }
}

interface DocumentViewerModalProps {
  document: DocumentBase
  onClose: () => void
}

export function DocumentViewerModal({ document, onClose }: DocumentViewerModalProps) {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Lista de visualizadores (facilmente extensível)
  const viewers: DocumentViewer[] = [
    new PdfViewer(),
    new ImageViewer(),
    new TextViewer(),
    new DefaultViewer()
  ]

  // Encontrar o visualizador apropriado para o documento
  const getViewer = (): DocumentViewer => {
    return viewers.find(viewer => viewer.canHandle(document)) || new DefaultViewer()
  }

  const currentViewer = getViewer()

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Criar URL para o arquivo
        const url = URL.createObjectURL(document.file)
        setDocumentUrl(url)
        
      } catch (err) {
        console.error('Erro ao carregar documento:', err)
        setError('Não foi possível carregar o documento')
      } finally {
        setIsLoading(false)
      }
    }

    loadDocument()

    // Cleanup: revogar URL quando o componente for desmontado
    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl)
      }
    }
  }, [document])

  const getDocumentTitle = (): string => {
    return document.data?.titulo || document.file.name
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[98vw] h-[95vh] max-h-[95vh] flex flex-col p-0 overflow-hidden">
        <DialogDescription className="sr-only">
          Visualização do documento {getDocumentTitle()}
        </DialogDescription>
        
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5" />
            <div>
              <DialogTitle className="text-lg font-medium">
                {getDocumentTitle()}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Document Viewer */}
        <div className="flex-1 bg-gray-50 overflow-hidden">
          <div className="w-full h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-16 w-16 mx-auto text-primary mb-4 animate-spin" />
                  <h3 className="text-lg font-medium mb-2">Carregando documento...</h3>
                  <p className="text-muted-foreground">Aguarde enquanto o documento é carregado</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Erro ao carregar documento</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                </div>
              </div>
            ) : documentUrl ? (
              currentViewer.render(document, documentUrl)
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Documento não disponível</h3>
                  <p className="text-muted-foreground mb-4">Não foi possível carregar o documento</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer com informações do documento */}
        {document?.data && (
          <div className="flex items-center justify-between p-4 border-t bg-muted/20 flex-shrink-0">
            <div className="text-sm text-muted-foreground">
              {document.data.total_paginas && (
                <><strong>Total:</strong> {document.data.total_paginas} páginas • </>
              )}
              {document.data.total_tokens && (
                <>{document.data.total_tokens.toLocaleString()} tokens</>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}