export interface DataResponse {
  uuid_documento: string;
  arquivo_original: string;
  titulo_arquivo: string;
  extensao: string;
  total_paginas: number;
  total_tokens: number;
  paginas: Pagina[];
}

export interface Pagina {
  fonte: string;
  numero_pagina: number;
  quantidade_tokens: number;
  texto: string;
}
