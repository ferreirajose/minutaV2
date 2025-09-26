import type { TipoDocumento } from "@/enums/tipo-documento";

export interface Data {
  uuid_documento: string;
  arquivo_original: string;
  titulo_arquivo: string;
  extensao: string;
  total_paginas: number;
  total_tokens: number;
  paginas: string[];
  texto_total: string;
}

export interface DocumentosData {
  id: string;
  file: File;
  tipo: TipoDocumento;
  data?: Data;
  isProcessed: boolean;
  hasError: boolean;
  isUploading: boolean;
  uploadProgress: number;
}
