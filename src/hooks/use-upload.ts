import { DocumentosBase } from '../domain/entity/Documentos';

import { useState, useRef, useCallback } from 'react'
// antes
// interface UploadedFile {
//   id: string
//   file: File
// }


// export function useFileUpload() {
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
//   const [isDragging, setIsDragging] = useState(false)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const addFiles = useCallback((files: File[]) => {
//     const newFiles: UploadedFile[] = files.map(file => ({
//       id: Math.random().toString(36).substr(2, 9),
//       file
//     }))
    
//     setUploadedFiles(prev => [...prev, ...newFiles])
//     return newFiles
//   }, [])

//   const removeFile = useCallback((id: string) => {
//     setUploadedFiles(prev => prev.filter(file => file.id !== id))
//   }, [])

//   const clearFiles = useCallback(() => {
//     setUploadedFiles([])
//   }, [])

//   return {
//     uploadedFiles,
//     isDragging,
//     fileInputRef,
//     addFiles,
//     removeFile,
//     clearFiles,
//     setIsDragging
//   }
// }


interface UploadedDocument {
  id: string
  document: DocumentosBase
}

export function useFileUpload() {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addDocuments = useCallback((documents: DocumentosBase[]) => {
    const newDocuments: UploadedDocument[] = documents.map(doc => ({
      id: doc.id,
      document: doc
    }))
    
    setUploadedDocuments(prev => [...prev, ...newDocuments])
    return newDocuments
  }, [])

  const removeDocument = useCallback((id: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id))
  }, [])

  const clearDocuments = useCallback(() => {
    setUploadedDocuments([])
  }, [])

  return {
    uploadedDocuments,
    isDragging,
    fileInputRef,
    addDocuments,
    removeDocument,
    clearDocuments,
    setIsDragging
  }
}