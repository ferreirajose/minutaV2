import type { DataResponse } from './../interface/documentos-base';
import { DocumentosBase, DocumentType } from '../domain/entity/Documentos';

export function createMockFile(name: string, size: number, type: string): File {
    const file = new File(["content"], name, { type: type, lastModified: new Date().getTime() });
    Object.defineProperty(file, 'size', { value: size });
    return file;
}


export function createMockDocumento(id: string, file: File, type: DocumentType, data: Partial<DataResponse>): DocumentosBase {
    const doc = new DocumentosBase(id, file, type, data);
    return doc;
}