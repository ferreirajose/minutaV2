"use client"

//import { CreateDocumentFactory } from "@/application/CreateDocument";
import { FileUpload } from "../FileUpload"
import { DocumentType } from "../../../domain/entity/Documentos";
import { DocumentosBase } from "../../../domain/entity/Documentos";

export function DocumentosContent() {
  const handleFilesSelected = (documents: DocumentosBase[]) => {
    console.log('Documentos selecionados:', documents)
    
    // Usando a factory
    documents.forEach(doc => {
          console.log('Documentos selecionados:', doc)

      //const createdDoc = new CreateDocumentFactory().execute(doc)
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Documentos</h1>
      
      <FileUpload
        onFilesSelected={handleFilesSelected}
        acceptedFileTypes=".pdf,.doc,.docx,.jpg,.png"
        maxFileSize={2 * 1024 * 1024} // 2MB
        documentType={DocumentType.DOC}
        multiple={true}
      />
    </div>
  )
}
