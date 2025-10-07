// import DocumentBase, { DocumentType } from "@/domain/entity/DocumentBase";
// import { createMockFile } from "./utils-test";

// const fileName = 'SEI_001.009036_2024_24 YONEIDE BEZERRA DO ESPÍRITO SANTO'
// const file = createMockFile(fileName, 1000, 'pdf');
// const id = Math.random().toString(36).substring(2, 9 + 2);
// const docType = DocumentType.DOC;

// describe("DocumentBase", () => {
//     it("Deve criar um DocumentBase", () => {
        
//         const doc = new DocumentBase(id, file, docType);

//         expect(doc).toBeInstanceOf(DocumentBase)

//         //expect(doc.id).toBe(1)
//         expect(doc.type).toBe(DocumentType.DOC)
//         expect(doc.file.size).toBe(1000)
//         expect(doc.file.name).toBe(fileName)

//         console.log(doc)
//     })
// })

import DocumentBase, { DocumentType } from "@/domain/entity/DocumentBase";
import { createMockFile } from "./utils-test";

describe("DocumentBase", () => {
  let documentBase: DocumentBase;
  let file: File;
  let id: string;
  let docType: DocumentType;

  beforeEach(() => {
    const fileName = 'SEI_001.009036_2024_24 YONEIDE BEZERRA DO ESPÍRITO SANTO';
    file = createMockFile(fileName, 1000, 'pdf');
    id = Math.random().toString(36).substring(2, 9 + 2);
    docType = DocumentType.DOC;
    
    documentBase = new DocumentBase(id, file, docType);
  });

  it("Deve criar um DocumentBase", () => {
    expect(documentBase).toBeInstanceOf(DocumentBase);
    expect(documentBase.type).toBe(DocumentType.DOC);
    expect(documentBase.file.size).toBe(1000);
    expect(documentBase.file.name).toBe('SEI_001.009036_2024_24 YONEIDE BEZERRA DO ESPÍRITO SANTO');
  });
});