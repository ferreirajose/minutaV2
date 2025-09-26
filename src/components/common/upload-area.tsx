"use client"

import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { FileText, Upload, Loader2 } from "lucide-react"

interface UploadAreaProps {
  isLoadingExisting?: boolean
  isDragOver: boolean
  onUploadButtonClick: () => void
  handleDragEnter: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  getTotalUploadingFiles: () => number
}

export function UploadArea({ 
  isLoadingExisting = false, 
  onUploadButtonClick,
  isDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  getTotalUploadingFiles
}: UploadAreaProps) {

  return (
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
      onClick={!isDragOver && !isLoadingExisting ? onUploadButtonClick : undefined}
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
                    onUploadButtonClick()
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
                    <strong>Tamanho máximo:</strong> 100MB por arquivo
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}