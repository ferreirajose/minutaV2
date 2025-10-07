"use client"

import FileUpload from "../FileUpload"

export function DocumentosContent() {
  const handleFilesSelected = (documents: any) => {
    console.log('Documentos selecionados:', documents)
    
    // Usando a factory
    documents.forEach(doc => {
          console.log('Documentos selecionados:', doc)
    })
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
