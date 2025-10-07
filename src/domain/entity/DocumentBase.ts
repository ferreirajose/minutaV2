import type { DataResponse } from "../../interface/documentos-base";

export enum DocumentType {
    DOC = 'DOCUMENTO',
    MODELO = 'MODELO',
    JURISPRUDENCIA = 'JURISPRUDENCIA'
}

export default class DocumentBase {
    public readonly id: string;
    public file: File;
    public type: DocumentType;
    public data?: Partial<DataResponse> | null; // Usando Partial para tornar todas as propriedades opcionais ou null

    constructor(id: string, file: File, type: DocumentType, data?: Partial<DataResponse> | null) {
        this.id = id;
        this.file = file;
        this.type = type;
        this.data = data;
    }

    toJSON() {
        return {
            id: this.id,
            fileName: this.file.name,
            fileType: this.file.type,
            fileSize: this.file.size,
            type: this.type,
            data: this.data
        };
    }
}