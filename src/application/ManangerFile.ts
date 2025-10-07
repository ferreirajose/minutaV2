export default class ManangerFile {
  private typesValidos: Record<string, string>;
  private defaultTypes = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".doc": "application/msword",
    ".html": "text/html",
    ".htm": "text/html",
    ".txt": "text/plain",
  };

  constructor(acceptedTypes?: string[]) {
    // Se tipos específicos foram fornecidos, filtrar os tipos válidos
    if (acceptedTypes && acceptedTypes.length > 0) {
      this.typesValidos = {};
      acceptedTypes.forEach(type => {
        const normalizedType = type.startsWith('.') ? type : `.${type}`;
        if (this.defaultTypes[normalizedType as keyof typeof this.defaultTypes]) {
          this.typesValidos[normalizedType] = this.defaultTypes[normalizedType as keyof typeof this.defaultTypes];
        }
      });
    } else {
      // Usar todos os tipos padrão se nenhum for especificado
      this.typesValidos = { ...this.defaultTypes };
    }
  }

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
    const expectedMimeType = this.typesValidos[fileExtension];
    return file.type === expectedMimeType;
  }

  // @TODO VALIDAR TAMANHO DO ARQUIVO
  validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
  }


}