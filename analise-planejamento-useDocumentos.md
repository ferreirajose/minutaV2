# Análise e Planejamento - Sistema de Gerenciamento de Documentos

## 1. Visão Geral

Este documento apresenta uma análise detalhada do sistema de gerenciamento de documentos, focado nos seguintes componentes principais:
- `useControleDocumentos.ts`: Hook principal para gerenciamento de documentos
- `documentos-content.tsx`: Componente principal para exibição e interação com documentos
- `document-viewer-modal.tsx`: Componente para visualização de documentos

## 2. Mapeamento de Dependências

### 2.1 Dependências Externas
- **React e Hooks**: `useState`, `useEffect`, `useRef`, `useCallback`
- **React Router**: `useSearchParams`, `useNavigate`
- **Lucide Icons**: `FileText`, `Trash2`, `ArrowRight`, `Loader2`, `Upload`, `Eye`, `RefreshCw`, `AlertTriangle`
- **Serviços**: `projectService`
- **Contextos**: `useDocumentIds`, `useTokens`

### 2.2 Dependências Internas
- **Tipos**: `DocumentoStatus`, `DocumentoUpload`
- **Utilitários**: `cn`, `formatFileSize`
- **Componentes**: `Button`, `Card`, `TokenUsageBar`

## 3. Interfaces Principais

### 3.1 `DocumentoUpload`
```typescript
interface DocumentoUpload {
  id?: string;
  file: File | null;
  name: string;
  size: number;
  type: string;
  status: DocumentoStatus;
  progress?: number;
  error?: string;
  clientId: string;
  isUploading: boolean;
  uploadProgress?: number;
  fileType?: string;
}
```

### 3.2 `DocumentViewerState`
```typescript
interface DocumentViewerState {
  isOpen: boolean;
  selectedDocument: any | null; // TODO: Tipar corretamente
}
```

### 3.3 `UseControleDocumentosReturn`
```typescript
interface UseControleDocumentosReturn {
  fileInputRef: React.RefObject<HTMLInputElement>;
  isDragOver: boolean;
  isLoadingExisting: boolean;
  uploadedDocuments: DocumentoUpload[];
  clearUploadedDocuments: () => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleUploadButtonClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteDocument: (doc: DocumentoUpload) => void;
  handleRetryUpload: (doc: DocumentoUpload) => void;
  handleExpandirVisualizacao: (doc: DocumentoUpload) => void;
  documentViewerState: DocumentViewerState;
  closeDocumentViewer: () => void;
  getTotalUploadingFiles: () => number;
  getDocumentStatus: (doc: DocumentoUpload) => string;
  getFileTypeIcon: (fileName: string) => React.ComponentType;
  isLimitReached: boolean;
}
```

## 4. Fluxo Atual

### 4.1 Upload de Documentos
1. Usuário arrasta e solta arquivos ou clica para selecionar
2. `handleFileChange` ou `handleDrop` processa os arquivos
3. Arquivos são validados (tamanho, tipo)
4. Estado é atualizado com os novos documentos
5. Upload é iniciado para cada arquivo
6. Progresso é atualizado em tempo real
7. Ao concluir, status é atualizado para 'success' ou 'error'

### 4.2 Visualização de Documentos
1. Usuário clica em um documento para visualizar
2. `handleExpandirVisualizacao` é chamado
3. Modal é aberto com o documento selecionado
4. Usuário pode navegar entre documentos ou fechar o modal

## 5. Pontos de Atenção

### 5.1 Acoplamento
- Forte acoplamento com `projectService`
- Dependência direta de múltiplos contextos
- Lógica de negócio misturada com UI

### 5.2 Tipagem
- Uso de `any` em alguns locais (ex: `selectedDocument`)
- Tipos genéricos poderiam ser mais específicos

### 5.3 Testabilidade
- Dificuldade em testar devido a dependências diretas
- Lógica de negócio não isolada
- Efeitos colaterais diretos

## 6. Estrutura de Pastas do Projeto

```
src/
├── assets/                 # Arquivos estáticos (imagens, ícones, etc.)
├── components/            # Componentes reutilizáveis
│   ├── common/            # Componentes comuns compartilhados
│   ├── layout/            # Componentes de layout (cabeçalho, rodapé, etc.)
│   ├── modals/            # Componentes de modais
│   ├── pages/             # Componentes específicos de páginas
│   └── ui/                # Componentes de interface do usuário
├── contexts/              # Contextos React
├── hooks/                 # Hooks personalizados
├── lib/                   # Utilitários e funções auxiliares
├── pages/                 # Páginas da aplicação
│   ├── dashboard-page.tsx
│   ├── home-page.tsx
│   ├── landing-page.tsx
│   └── not-found-page.tsx
├── services/              # Serviços e lógica de negócios
└── types/                 # Definições de tipos TypeScript
```

Esta estrutura segue boas práticas de organização de código, separando claramente:
- Componentes por funcionalidade
- Lógica de negócio
- Tipos e interfaces
- Recursos estáticos
- Configurações e utilitários

A estrutura modular facilita a manutenção e escalabilidade do projeto, permitindo que novas funcionalidades sejam adicionadas de forma organizada.

## 7. Próximos Passos

### 7.1 Refatorações Imediatas
1. Extrair lógica de negócio para hooks especializados
2. Implementar injeção de dependências
3. Melhorar tipagem

### 7.2 Melhorias de Arquitetura
1. Implementar padrão Strategy para tipos de arquivo
2. Criar camada de serviço para operações de rede
3. Isolar lógica de estado

### 7.3 Testes
1. Escrever testes unitários para funções puras
2. Implementar testes de integração
3. Configurar ambiente de testes

## 8. Recomendações

1. **Separação de Responsabilidades**: Dividir o hook em hooks menores e mais especializados
2. **Inversão de Dependência**: Injetar serviços ao invés de importá-los diretamente
3. **Tipagem Forte**: Remover usos de `any` e melhorar as interfaces
4. **Testes**: Implementar testes automatizados para garantir qualidade
5. **Documentação**: Manter documentação atualizada com as mudanças

## 8. Estrutura SOLID Proposta

1. **Baseado na análise e nos princípios SOLID, segue uma estrutura de diretórios otimizada:**

```
src/
├── core/
│   ├── domain/                    # Entidades e interfaces de domínio
│   │   ├── entities/             # Entidades de negócio
│   │   │   ├── document.ts
│   │   │   └── project.ts
│   │   └── interfaces/           # Portas (interfaces)
│   │       ├── repositories/     
│   │       └── services/
│   │
│   └── application/             # Casos de uso
│       ├── use-cases/
│       │   ├── documents/
│       │   │   ├── UploadDocumentUseCase.ts
│       │   │   ├── DeleteDocumentUseCase.ts
│       │   │   └── ViewDocumentUseCase.ts
│       │   └── projects/
│       └── dtos/                # Objetos de transferência de dados // parte do
│
├── infrastructure/
│   ├── http/                    # Clientes HTTP
│   ├── storage/                 # Armazenamento local/remoto
│   └── services/                # Implementações concretas
│       ├── DocumentService.ts
│       └── ProjectService.ts
│
├── presentation/
│   ├── components/              
│   │   ├── documents/          
│   │   │   ├── DocumentList/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── DocumentList.tsx
│   │   │   │   └── hooks/
│   │   │   └── DocumentUpload/
│   │   │       ├── index.tsx
│   │   │       └── hooks/
│   │   └── shared/             # Componentes compartilhados
│   │
│   ├── pages/
│   │   ├── documents/
│   │   │   ├── DocumentsPage.tsx
│   │   │   └── components/     # Componentes específicos da página
│   │   └── projects/
│   │
│   └── providers/              # Contextos e provedores
│       └── DocumentProvider.tsx
│
├── shared/
│   ├── hooks/                  # Hooks reutilizáveis
│   ├── utils/                  # Utilitários
│   └── types/                  # Tipos globais
│
└── config/
    ├── routes.tsx             # Configuração de rotas
    └── theme.ts               # Configuração de temas
```

---------------------------------------------------------------
1. **Lista de Tarefas:**

```
- [] src/
  - [X] core/
    - [X] domain/                    # Entidades e interfaces de domínio
      - [X] entities/             # Entidades de negócio
        - [X] document.ts
        - [X] project.ts
      - [X] interfaces/           # Portas (interfaces)
        - [X] repositories/     
        - [X] services/
    - [X] application/             # Casos de uso
      - [X] use-cases/
        - [X] documents/
          - [X] UploadDocumentUseCase.ts
          - [X] DeleteDocumentUseCase.ts
          - [X] ViewDocumentUseCase.ts
        - [X] projects/
      - [X] dtos/                # Objetos de transferência de dados
  - [X] infrastructure/
    - [X] http/                    # Clientes HTTP
    - [X] storage/                 # Armazenamento local/remoto
    - [X] services/                # Implementações concretas
      - [X] DocumentService.ts
      - [X] ProjectService.ts
  - [ ] presentation/
    - [X] components/              
      - [X] documents/          
        - [X] DocumentList/
          - [X] index.tsx  = não é necessário
          - [X] DocumentList.tsx
          - [] hooks/ = verificar a necessidade de hooks
        - [X] DocumentUpload/
          - [X] index.tsx = não é necessário
          - [] hooks/ = verificar a necessidade de hooks
      - [ ] shared/             # Componentes compartilhados
    - [ ] pages/
      - [ ] documents/
        - [ ] DocumentsPage.tsx
        - [ ] components/     # Componentes específicos da página
      - [ ] projects/
    - [ ] providers/              # Contextos e provedores
      - [ ] DocumentProvider.tsx
  - [ ] shared/
    - [ ] hooks/                  # Hooks reutilizáveis
    - [ ] utils/                  # Utilitários
    - [ ] types/                  # Tipos globais
  - [ ] config/
    - [ ] routes.tsx             # Configuração de rotas
    - [ ] theme.ts               # Configuração de temas
```

### Princípios SOLID Aplicados:

1. **Single Responsibility Principle (SRP)**
   - Cada arquivo/classe tem uma única responsabilidade
   - Separação clara entre domínio, aplicação e infraestrutura

2. **Open/Closed Principle (OCP)**
   - Novos tipos de documentos podem ser adicionados sem modificar o código existente
   - Extensibilidade através de interfaces

3. **Liskov Substitution Principle (LSP)**
   - Interfaces bem definidas permitem substituição de implementações

4. **Interface Segregation Principle (ISP)**
   - Múltiplas interfaces específicas ao invés de uma interface genérica

5. **Dependency Inversion Principle (DIP)**
   - Módulos de alto nível não dependem de módulos de baixo nível
   - Ambos dependem de abstrações

### Benefícios da Nova Estrutura:

- **Testabilidade**: Facilidade para mockar dependências
- **Manutenibilidade**: Código mais organizado e coeso
- **Escalabilidade**: Fácil adição de novos recursos
- **Reusabilidade**: Componentes e serviços podem ser reutilizados
- **Flexibilidade**: Troca de implementações sem afetar o restante do sistema

### Próximos Passos de Implementação:

1. Criar a estrutura de diretórios proposta
2. Migrar gradualmente o código existente
3. Implementar testes unitários e de integração
4. Documentar as novas interfaces e contratos

Esta estrutura promove um design mais limpo, testável e manutenível, alinhado com as melhores práticas de desenvolvimento de software moderno.

---
**Última Atualização:** 04/09/2025  
**Responsável:** Equipe de Desenvolvimento Frontend
