# Roteiro de Atividades para Refatoração

## 1. Análise e Melhorias Baseadas em SOLID/OO

### 1.1 Princípios SOLID

#### Single Responsibility Principle (SRP)
**Problema:** `useControleDocumentos` com múltiplas responsabilidades  
**Solução:** Dividir em hooks especializados:
- `useDocumentUpload` - upload e processamento
- `useDocumentState` - gerenciamento de estado
- `useDocumentViewer` - lógica do visualizador

#### Open/Closed Principle (OCP)
**Problema:** Lógica de extensões de arquivo hardcoded  
**Solução:** Implementar padrão Strategy

```typescript
interface FileTypeHandler {
  icon: React.ComponentType;
  color: string;
  canHandle(extension: string): boolean;
  process(file: File): Promise<ProcessResult>;
}
```

#### Dependency Inversion Principle (DIP)
**Problema:** Acoplamento direto com serviços  
**Solução:** Injeção de dependências

```typescript
interface DocumentService {
  uploadAndProcess(file: File, tokenCallback?: (tokens: number) => void): Promise<ProcessResult>;
  getProjectByName(name: string): Promise<ProjectData>;
  viewOriginalFile(id: string): Promise<FileData>;
}
```

## 2. Problemas Identificados

### 2.1 Acoplamento Excessivo
- Componentes fortemente acoplados a hooks específicos
- Mudanças afetam múltiplos componentes

### 2.2 Dificuldade de Manutenção
- Lógica complexa de conversão
- Múltiplas responsabilidades no mesmo hook

### 2.3 Problemas de Performance
- Conversões desnecessárias
- Re-renders em cascata

### 2.4 Dificuldade de Extensão
- Adicionar novos tipos de arquivo é trabalhoso
- Lógica de visualização pouco flexível

## 3. Estratégias de Teste

### 3.1 Mock de Dependências
```typescript
const mockDocumentService: DocumentService = {
  uploadAndProcess: jest.fn(),
  getProjectByName: jest.fn(),
  viewOriginalFile: jest.fn()
};
```

### 3.2 Extrair Lógica Pura
```typescript
export const calculateFileSize = (docInfo: any): number => {
  if (docInfo.data?.texto_total) {
    return new TextEncoder().encode(docInfo.data.texto_total).length;
  }
  return 0;
};
```

## 4. Roteiro de Implementação

### Fase 1: Análise e Planejamento (Dia 1)
- Mapear dependências
- Definir interfaces
- Documentar fluxo atual

### Fase 2: Refatoração Core (Dias 2-4)
- Aplicar SRP
- Implementar padrão Strategy
- Configurar injeção de dependências

### Fase 3: Testabilidade (Dias 5-6)
- Criar factories para testes
- Extrair lógica pura
- Configurar ambiente de testes

### Fase 4: Componentes e UI (Dias 7-8)
- Refatorar componentes
- Melhorar DocumentViewerModal

### Fase 5: Integração e Validação (Dias 9-10)
- Integração gradual
- Testes de regressão

## 5. Métricas de Sucesso

| Métrica | Antes | Depois |
|---------|-------|--------|
| Acoplamento | Alto | Baixo |
| Cobertura de Testes | Baixa | >80% |
| Complexidade Ciclomática | Alta | Reduzida em 50% |

## 6. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Quebra de funcionalidade | Alto | Feature flags e testes de regressão |
| Aumento de complexidade | Médio | Abordagem incremental |
| Resistência da equipe | Baixo | Sessões de pair programming |

## 7. Próximos Passos
1. Revisar e aprovar o plano
2. Iniciar implementação da Fase 1
3. Realizar revisões semanais de progresso

---
**Status:** Planejado  
**Última atualização:** 04/09/2025  
**Responsável:** Equipe de Desenvolvimento Frontend