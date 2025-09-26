import { DocumentosBase, DocumentType } from "../Documentos";
import type { DataResponse } from './../interface/documentos-base';

function createMockFile(name: string, size: number, type: string): File {
    const file = new File(["content"], name, { type: type, lastModified: new Date().getTime() });
    Object.defineProperty(file, 'size', { value: size });
    return file;
}

function createMockDocumento(id: string, file: File, type: DocumentType, data: Partial<DataResponse>): DocumentosBase {
    const doc = new DocumentosBase(id, file, type, data);
    return doc;
}

const file = createMockFile("test.txt", 1024, "text/plain");
const data: Partial<DataResponse> = { uuid_documento: "value" }; // Não precisa de todas as propriedades

const doc = createMockDocumento("1", file, DocumentType.DOC, data);

describe('DocumentosBase', () => {
    it("Deve criar um documento do tipo 'DOCUMENTO' utilizando o DocumentosBase", () => {

        expect(doc.id).toBe("1");
        expect(doc.file).toBe(file);
        expect(doc.data).toBe(data);
        expect(doc.type).toBe(DocumentType.DOC);

    });

    it("Deve retorna um JSON", () => {
        
        const json = doc.toJSON();
        console.log(json);
        expect(json).toEqual({
            id: "1",
            fileName: "test.txt",
            fileType: "text/plain",
            fileSize: 1024,
            type: DocumentType.DOC,
            data: data
        });
    });
});