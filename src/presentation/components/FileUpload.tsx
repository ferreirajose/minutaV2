import type { DataResponse } from "@/interface/documentos-base"
import { DocumentosBase, DocumentType } from "../../domain/entity/Documentos"
import { useFileUpload } from "@/hooks/use-upload"
import { CreateDocument } from "@/application/CreateDocument"

interface FileUploadProps {
  onFilesSelected: (documents: DocumentosBase[]) => void
  acceptedFileTypes?: string
  maxFileSize?: number // em bytes
  multiple?: boolean
  documentType: DocumentType // Tipo padrão para os documentos
}

// Funções de validação
export const validateFileType = (file: File, acceptedTypes: string): boolean => {
  if (acceptedTypes === '*/*') return true
  
  const accepted = acceptedTypes.split(',').map(type => type.trim())
  return accepted.some(type => {
    if (type.startsWith('.')) {
      // Validação por extensão (.pdf, .jpg, etc)
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    } else {
      // Validação por MIME type (image/*, application/pdf, etc)
      if (type.endsWith('/*')) {
        const category = type.split('/')[0]
        return file.type.startsWith(category + '/')
      }
      return file.type === type
    }
  })
}

export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize
}

// Função para criar DocumentosBase a partir de Files
// const createDocumentosBase = (files: File[], documentType: DocumentType, data?: Partial<DataResponse> | null): DocumentosBase[] => {
//   return files.map(file => {
//     const id = Math.random().toString(36).substr(2, 9)
//     return new DocumentosBase(id, file, documentType, data)
//   })
// }

export function FileUpload({
  onFilesSelected,
  acceptedFileTypes = '*/*',
  maxFileSize = 5 * 1024 * 1024, // 5MB
  multiple = true,
  documentType
}: FileUploadProps) {
  const {
    uploadedDocuments,
    isDragging,
    fileInputRef,
    addDocuments,
    removeDocument,
    setIsDragging
  } = useFileUpload()

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const validFiles: File[] = []
    const invalidFiles: string[] = []

    Array.from(files).forEach(file => {
      const isTypeValid = validateFileType(file, acceptedFileTypes)
      const isSizeValid = validateFileSize(file, maxFileSize)

      if (isTypeValid && isSizeValid) {
        validFiles.push(file)
      } else {
        let errorMsg = `${file.name}: `
        if (!isTypeValid) errorMsg += `Tipo não permitido. `
        if (!isSizeValid) errorMsg += `Tamanho máximo: ${maxFileSize / 1024 / 1024}MB`
        invalidFiles.push(errorMsg)
      }
    })

    if (invalidFiles.length > 0) {
      alert(`Arquivos rejeitados:\n${invalidFiles.join('\n')}`)
    }

    if (validFiles.length > 0) {
      // Criar DocumentosBase a partir dos arquivos válidos
      // const documentos = new CreateDocument().execute(validFiles, documentType) //createDocumentosBase(validFiles, documentType)
      // addDocuments(documentos)
      // onFilesSelected(documentos)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    e.target.value = '' // Reset input
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  console.log(uploadedDocuments, 'uploadedDocuments')

  return (
    <div className="w-full">
      {/* Input file hidden */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept={acceptedFileTypes}
        multiple={multiple}
        className="hidden"
      />

      {/* Área de Drag & Drop */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center space-y-3">
          <UploadIcon />
          <div>
            <p className="font-medium text-gray-700">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Tipo: {documentType}
              <br />
              Tipos permitidos: {acceptedFileTypes === '*/*' ? 'Todos' : acceptedFileTypes}
              <br />
              Tamanho máximo: {maxFileSize / 1024 / 1024}MB
            </p>
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      {uploadedDocuments.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-gray-900">Documentos selecionados:</h3>
          {uploadedDocuments.map(({ id, document }) => (
            <div
              key={id}
              className="flex items-center justify-between p-3 bg-white border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileIcon /> 
                <div>
                  <span className="text-sm text-gray-700 block">{document.file.name}</span>
                  <span className="text-xs text-gray-500">
                    Tipo: {document.type} | {document.formatFileSize()} 
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeDocument(id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Ícones simplificados
function UploadIcon() {
  return (
    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}