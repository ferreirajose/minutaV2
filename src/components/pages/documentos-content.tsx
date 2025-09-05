"use client"

import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { FileText, Trash2, ArrowRight, Loader2, Upload, Eye, RefreshCw, AlertTriangle } from "lucide-react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { useControleDocumentos } from "@/controllers/useControleDocumentos"
import { formatFileSize } from "@/lib/utils"
import { useDocumentIds } from "@/context/document-ids-provider"
import { DocumentViewerModal } from "../modals/document-viewer-modal"
import { TokenUsageBar } from "../common/token-usage-bar"
import { useEffect } from "react"

export function DocumentosContent() {
  const {
    fileInputRef,
    isDragOver,
    clearUploadedDocuments,
    isLoadingExisting,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleUploadButtonClick,
    handleFileChange,
    handleDeleteDocument,
    handleRetryUpload,
    handleExpandirVisualizacao,
    documentViewerState,
    closeDocumentViewer,
    getTotalUploadingFiles,
    getDocumentStatus,
    getFileTypeIcon,
    isLimitReached
  } = useControleDocumentos()
  
  const navigate = useNavigate() // Adicione o hook useNavigate
  
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Documentos</h1>

      {/* Indicador de carregamento de documentos existentes */}
      {isLoadingExisting && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              <div>
                <h3 className="font-medium text-blue-800">Carregando documentos</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Carregando documentos existentes da minuta...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aviso se não tiver os IDs necessários - OCULTAR QUANDO projectName EXISTIR NA URL */}
      {!isLoadingExisting && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800">Atenção</h3>
                <p className="text-sm text-orange-700 mt-1">Para prosseguir para la Minuta Final, você precisa:</p>
                <ul className="text-sm text-orange-700 mt-2 space-y-1">
                  <li>• Fazer upload de pelo menos um documento</li>
                  <li>• Adicionar pelo menos um modelo de estilo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.html,.htm,.txt"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Área de Drop com Drag/Drop - OCULTAR QUANDO projectName EXISTIR NA URL */}
      {!projectName && (
        <Card
          className={`mb-8 transition-all duration-300 cursor-pointer ${
            isDragOver
              ? "border-primary border-2 bg-primary/10 shadow-lg scale-[1.02]"
              : "border-dashed border-2 hover:border-primary/50 hover:bg-muted/20"
          } ${isLoadingExisting ? "opacity-50 cursor-not-allowed" : ""}`}
          onDragEnter={isLoadingExisting ? undefined : handleDragEnter}
          onDragLeave={isLoadingExisting ? undefined : handleDragLeave}
          onDragOver={isLoadingExisting ? undefined : handleDragOver}
          onDrop={isLoadingExisting ? undefined : handleDrop}
          onClick={!isDragOver && !isLoadingExisting ? handleUploadButtonClick : undefined}
        >
          <CardContent className="p-8 flex flex-col items-center">
            {isLoadingExisting ? (
              <>
                <div className="p-4 rounded-full mb-6 bg-blue-100">
                  <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                </div>
                <h2 className="text-xl font-medium mb-2 text-blue-800">
                  Carregando documentos...
                </h2>
                <p className="text-muted-foreground mb-6 text-center max-w-lg">
                  Aguarde enquanto carregamos os documentos existentes da minuta
                </p>
              </>
            ) : (
              <>
                <div
                  className={`p-4 rounded-full mb-6 transition-all duration-300 ${
                    isDragOver ? "bg-primary/20 scale-110" : "bg-primary/10"
                  }`}
                >
                  {isDragOver ? (
                    <Upload className="h-10 w-10 text-primary animate-bounce" />
                  ) : (
                    <FileText className="h-10 w-10 text-primary" />
                  )}
                </div>

                <h2
                  className={`text-xl font-medium mb-2 transition-all duration-300 ${
                    isDragOver ? "text-primary scale-105" : ""
                  }`}
                >
                  {isDragOver ? "Solte os arquivos aqui!" : "Arraste e solte os documentos aqui"}
                </h2>

                <p className="text-muted-foreground mb-6 text-center max-w-lg">
                  {isDragOver
                    ? "Solte os arquivos para fazer o upload automático"
                    : "Faça upload dos documentos do processo: petições, decisões, peças processuais etc."}
                </p>

                {!isDragOver && (
                  <>
                    <Button
                      variant="outline"
                      className="flex items-center bg-transparent mb-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUploadButtonClick()
                      }}
                      disabled={getTotalUploadingFiles() > 0}
                    >
                      {getTotalUploadingFiles() > 0 ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          <span>Processando {getTotalUploadingFiles()} arquivo(s)...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          <span>Selecionar Arquivos</span>
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Tipos aceitos:</strong> PDF, HTML, TXT
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Tamanho máximo:</strong> {formatFileSize(MAX_FILE_SIZE)} por arquivo
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lista de Documentos - Mostrar apenas quando não estiver carregando */}
      {!isLoadingExisting && documentos.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Documentos ({documentos.length})</h2>
            {!projectName && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center bg-transparent"
                onClick={clearUploadedDocuments}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Limpar tudo</span>
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {(documentos ||[]).map((doc: any, idx:number) => {
              const status = getDocumentStatus(doc)
              return (
                <Card key={idx} className={`transition-all duration-200 ${status.bgColor}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <div className="bg-white p-2 rounded mr-3 shadow-sm">{getFileTypeIcon(doc)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{doc.data?.titulo_arquivo || doc.file.name}</div>
                          <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                            <span>{formatFileSize(doc.file.size)}</span>
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
                      {!projectName && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive ml-2"
                          onClick={() => handleDeleteDocument(doc)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Botões de ação */}
                    <div className="flex gap-2 mt-4 ml-10">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExpandirVisualizacao(doc)}
                        disabled={!doc.data}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Expandir Visualização
                      </Button>
                      {doc.hasError && !projectName && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetryUpload(doc)}
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
        </div>
      )}

      {/* Botão de navegação - Desabilitar durante carregamento */}
      {!isLoadingExisting && (
        <div className="flex justify-end mt-8">
          <Button
            size="lg"
            className="px-8 py-3"
            asChild
            disabled={isLimitReached() || documentos.length === 0}
          >
            <Link 
              to={projectName ? `/modelos?projectName=${encodeURIComponent(projectName)}` : "/modelos?creation=true"}
            >
              <span className="mr-2">Próximo</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      )}

    </div>
  )
}