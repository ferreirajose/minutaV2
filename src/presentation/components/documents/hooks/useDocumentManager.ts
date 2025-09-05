import { useState, useCallback } from 'react';
import { Document } from '@/core/domain/entities/document';

interface UseDocumentManagerProps {
  initialDocuments?: Document[];
  onDocumentDelete?: (documentId: string) => Promise<void>;
  onDocumentView?: (document: Document) => void;
}

export function useDocumentManager({
  initialDocuments = [],
  onDocumentDelete,
  onDocumentView,
}: UseDocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleDelete = useCallback(
    async (documentId: string) => {
      try {
        setIsLoading(true);
        await onDocumentDelete?.(documentId);
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete document'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [onDocumentDelete]
  );

  const handleView = useCallback(
    (document: Document) => {
      onDocumentView?.(document);
    },
    [onDocumentView]
  );

  const addDocuments = useCallback((newDocuments: Document[]) => {
    setDocuments((prev) => [...prev, ...newDocuments]);
  }, []);

  return {
    documents,
    isLoading,
    error,
    handleDelete,
    handleView,
    addDocuments,
  };
}