export default class DocumentList {
  private typesValidos = {
    ".pdf": "application/pdf",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".doc": "application/msword",
    ".html": "text/html",
    ".txt": "text/plain",
  };

  constructor() {}

  // @TODO VALIDAR EXTENSÃO DO ARQUIVO
  validateFileType(file: File): boolean {
    if (!file || !file.name || !file.type) {
      return false;
    }

    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf("."));

    // Verifica se a extensão é válida
    if (!Object.prototype.hasOwnProperty.call(this.typesValidos, fileExtension)) {
      return false;
    }

    // Verifica se o mime-type corresponde à extensão esperada
    const expectedMimeType = this.typesValidos[fileExtension as keyof typeof this.typesValidos];
    return file.type === expectedMimeType;
  }

  // @TODO VALIDAR TAMANHO DO ARQUIVO
  validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
  }

}
