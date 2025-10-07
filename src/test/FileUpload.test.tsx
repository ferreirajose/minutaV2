import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import FileUpload from '@/presentation/components/FileUpload'

// Mock para console.log para não poluir os logs dos testes
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})

describe('FileUpload Component', () => {
  let handleFilesSelected: jest.Mock
  
  beforeEach(() => {
    // Configuração inicial antes de cada teste
    handleFilesSelected = jest.fn()
  })

  afterEach(() => {
    // Limpeza após cada teste
    cleanup()
    jest.clearAllMocks()
  })

  test('deve renderizar o componente corretamente', () => {
    // ARRANGE
    render(
      <FileUpload 
        acceptedTypes={['.pdf', '.docx', '.txt']}
        maxFileSize={5 * 1024 * 1024}
        multiple={true}
        onFilesSelected={handleFilesSelected}
      />
    )

    // ASSERT - Verifica se os elementos principais estão renderizados
    expect(screen.getByText('Arraste e solte os documentos aqui')).toBeInTheDocument()
    expect(screen.getByText('Selecionar Arquivos')).toBeInTheDocument()
    expect(screen.getByText(/Tipos aceitos:/)).toBeInTheDocument()
    expect(screen.getByText(/Tamanho máximo:/)).toBeInTheDocument()
  })

  test('deve aplicar os parâmetros corretamente', () => {
    // ARRANGE
    const customProps = {
      acceptedTypes: ['.pdf', '.docx'],
      maxFileSize: 2 * 1024 * 1024, // 2MB
      multiple: false,
      disabled: true
    }

    render(<FileUpload {...customProps} onFilesSelected={handleFilesSelected} />)

    // ASSERT - Verifica se os parâmetros foram aplicados corretamente
    expect(screen.getByText('PDF, DOCX')).toBeInTheDocument() // Tipos aceitos
    expect(screen.getByTestId('maxSize')).toBeInTheDocument() // Tamanho máximo 
    expect(screen.getByTestId('maxSize').textContent).toBe('2 MB') // Tamanho máximo 
    
    // Verifica se o botão está desabilitado quando disabled=true
    const uploadButton = screen.getByText('Selecionar Arquivos').closest('button')
    expect(uploadButton).toBeDisabled()
  })

  // test('deve exibir a área de drag and drop quando não está em drag over', () => {
  //   // ARRANGE
  //   render(<FileUpload onFilesSelected={handleFilesSelected} />)

  //   // ASSERT
  //   expect(screen.getByText('Arraste e solte os documentos aqui')).toBeInTheDocument()
  //   expect(screen.getByText('Faça upload dos documentos do processo: petições, decisões, peças processuais etc.')).toBeInTheDocument()
  // })

  // test('deve abrir o seletor de arquivos ao clicar no botão', async () => {
  //   // ARRANGE
  //   const user = userEvent.setup()
  //   render(<FileUpload onFilesSelected={handleFilesSelected} />)

  //   // Cria um mock para o input file
  //   const fileInput = screen.getByDisplayValue('') as HTMLInputElement
  //   const clickSpy = jest.spyOn(fileInput, 'click')

  //   // ACT
  //   const uploadButton = screen.getByText('Selecionar Arquivos')
  //   await user.click(uploadButton)

  //   // ASSERT
  //   expect(clickSpy).toHaveBeenCalledTimes(1)
  // })

  // test('deve exibir mensagem de processamento quando há arquivos sendo enviados', () => {
  //   // ARRANGE - Mock do estado interno (em casos reais, você pode usar testing-library/hooks)
  //   // Este teste é mais complexo e pode requerer refatoração do componente para melhor testabilidade
    
  //   render(<FileUpload onFilesSelected={handleFilesSelected} />)
    
  //   // Este teste seria melhor implementado com uma refatoração do componente
  //   // para permitir controle externo do estado de upload
  //   expect(screen.queryByText(/Processando/)).not.toBeInTheDocument()
  // })

  // test('deve exibir lista de arquivos quando há arquivos selecionados', () => {
  //   // ARRANGE
  //   // Em um cenário real, você pode mockar o estado ou usar uma versão do componente
  //   // que permita controle externo do estado de arquivos selecionados
    
  //   render(<FileUpload onFilesSelected={handleFilesSelected} />)
    
  //   // Inicialmente não deve mostrar lista de arquivos
  //   expect(screen.queryByText(/Arquivos selecionados/)).not.toBeInTheDocument()
  // })
})