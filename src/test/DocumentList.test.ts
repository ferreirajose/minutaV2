import DocumentList from "@/application/DocumentList";
import { createMockFile } from "./utils-test";

describe("DocumentList", () => {
  let documentList: DocumentList;

  beforeEach(() => {
    documentList = new DocumentList();
  });

  describe("DocumentList Validar Tamanho", () => {
    it("Deve retornar true quando o arquivo for menor que o tamanho máximo 5MB", () => {
      // Arrange
      const smallFile = createMockFile("small.pdf", 5 * 1024 * 1024, "pdf"); // 5MB
      const maxSize = 10 * 1024 * 1024; // 10MB

      // Act
      const result = documentList.validateFileSize(smallFile, maxSize);

      // Assert
      expect(result).toBe(true);
    });

    it("Deve retornar true quando o arquivo for igual ao tamanho máximo 10MB", () => {
      // Arrange
      const exactSizeFile = createMockFile(
        "exact.pdf",
        10 * 1024 * 1024,
        "pdf"
      ); // 10MB
      const maxSize = 10 * 1024 * 1024; // 10MB

      // Act
      const result = documentList.validateFileSize(exactSizeFile, maxSize);

      // Assert
      expect(result).toBe(true);
    });

    it("Deve retornar false quando o arquivo for maior que o tamanho máximo 15MB", () => {
      // Arrange
      const largeFile = createMockFile("large.pdf", 15 * 1024 * 1024, "pdf"); // 15MB
      const maxSize = 10 * 1024 * 1024; // 10MB

      // Act
      const result = documentList.validateFileSize(largeFile, maxSize);

      // Assert
      expect(result).toBe(false);
    });

    it("Deve retornar true para arquivo muito pequeno 100 bytes", () => {
      // Arrange
      const tinyFile = createMockFile("tiny.pdf", 100, "pdf"); // 100 bytes
      const maxSize = 10 * 1024 * 1024; // 10MB

      // Act
      const result = documentList.validateFileSize(tinyFile, maxSize);

      // Assert
      expect(result).toBe(true);
    });

    it("Deve retornar false quando maxSize for 0 bits", () => {
      // Arrange
      const file = createMockFile("any.pdf", 1000, "pdf");
      const maxSize = 0;

      // Act
      const result = documentList.validateFileSize(file, maxSize);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("DocumentList Validar Tipo de Arquivo", () => {
    it("Deve retornar true para arquivo PDF válido (extensão e mime-type)", () => {
      // Arrange
      const pdfFile = createMockFile("documento.pdf", 1000, "application/pdf");

      // Act
      const result = documentList.validateFileType(pdfFile);

      // Assert
      expect(result).toBe(true);
    });

    it("Deve retornar false para arquivo com extensão PDF mas mime-type incorreto", () => {
      // Arrange
      const fakePdfFile = createMockFile(
        "documento.pdf",
        1000,
        "application/exe"
      );

      // Act
      const result = documentList.validateFileType(fakePdfFile);

      // Assert
      expect(result).toBe(false);
    });

    it("Deve retornar false para arquivo sem mime-type", () => {
      // Arrange
      const noMimeFile = createMockFile("documento.pdf", 1000, "");

      // Act
      const result = documentList.validateFileType(noMimeFile);

      // Assert
      expect(result).toBe(false);
    });

    it("Deve validar DOCX corretamente", () => {
      // Arrange
      const docxFile = createMockFile(
        "documento.docx",
        1000,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

      // Act
      const result = documentList.validateFileType(docxFile);

      // Assert
      expect(result).toBe(true);
    });

    it("Deve validar DOC corretamente", () => {
      // Arrange
      const docFile = createMockFile(
        "documento.doc",
        1000,
        "application/msword"
      );

      // Act
      const result = documentList.validateFileType(docFile);

      // Assert
      expect(result).toBe(true);
    });
  });
});
