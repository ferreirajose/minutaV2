"use client"

import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Trash2, Eye, RefreshCw } from "lucide-react"
import type { JSX } from "react"

interface DocumentListProps {
  documentos: any[]
  onDeleteDocument: (doc: any) => void
  onRetryUpload: (doc: any) => void
  onExpandView: (doc: any) => void
  getDocumentStatus: (doc: any) => any
  getFileTypeIcon: (doc: any) => JSX.Element
}

export function DocumentList({ 
  documentos, 
  onDeleteDocument, 
  onRetryUpload, 
  onExpandView,
  getDocumentStatus,
  getFileTypeIcon
}: DocumentListProps) {
  
  if (!documentos || documentos.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {documentos.map((doc: any, idx: number) => {
        const status = getDocumentStatus(doc)
        return (
          <Card key={idx} className={`transition-all duration-200 ${status.bgColor}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <div className="bg-white p-2 rounded mr-3 shadow-sm">{getFileTypeIcon(doc)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{doc.data?.titulo_arquivo}</div>
                    <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                      <span>Formatação do arquivo</span>
                      {doc.data && (
                        <span>
                          • {doc.data.total_paginas} páginas • {doc.data.total_tokens.toLocaleString()} tokens
                        </span>
                      )}
                    </div>
                    <div className={`text-sm mt-2 flex items-center gap-2 ${status.color}`}>
                      {status.icon}
                      <span>{status.text}</span>
                    </div>
                    {doc.hasError && doc.errorMessage && (
                      <div className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded">{doc.errorMessage}</div>
                    )}
                    {doc.isUploading && doc.uploadProgress !== undefined && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${doc.uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive ml-2"
                  onClick={() => onDeleteDocument(doc)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2 mt-4 ml-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExpandView(doc)}
                  disabled={!doc.data}
                  className="flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Expandir Visualização
                </Button>
                {doc.hasError && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetryUpload(doc)}
                    className="flex items-center text-orange-600 hover:text-orange-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}