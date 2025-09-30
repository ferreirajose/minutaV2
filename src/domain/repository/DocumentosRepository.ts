import type { ResponseData } from '../../interface/documentos-base';

export interface DocumentosRepository {
    uploadAndProcess(file: File): Promise<ResponseData>;
    viewOriginalFile(id: string): Promise<{ blob: Blob; filename: string } | null> 
}
