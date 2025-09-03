# Minuta V2

Projeto desenvolvido com React, Vit e TypeScript.

## 📥 Como baixar

1. Clone o repositório:

   - Usando HTTP:
   ```bash
   git clone git@github.com:ferreirajose/minutaV2.git
   ```

   - Usando SSH:
   ```bash
   git clone  https://github.com/ferreirajose/minutaV2.git
   ```

2. Acesse a pasta do projeto:
```bash
cd minutaV2
```

## 🛠️ Instalação de dependências

1. Instale as dependências do projeto:
```bash
npm install
```

2. Copie o arquivo de exemplo de ambiente:
```bash
cp .env.exemple .env
```

## 🔐 Arquivos .env

O projeto utiliza variáveis de ambiente para configuração. Você deve criar um arquivo `.env` baseado no arquivo [.env.exemple](cci:7://file:///c:/seu_usuario/minutaV2/.env.exemple:0:0-0:0) fornecido:

```bash
VITE_API_BASE_URL=https://api.seuservidor.com.br
VITE_API_AUTH_TOKEN=seu-token-aqui
```

3. Configure as variáveis de ambiente no arquivo `.env` conforme necessário.

## 📁 Estrutura do projeto

```
.
├── public/              # Arquivos estáticos
├── src/                 # Código fonte
├── .env.exemple         # Exemplo de arquivo de ambiente
├── package.json         # Dependências e scripts
├── tsconfig.json        # Configuração do TypeScript
├── vite.config.ts      # Configuração do Vite
├── tailwind.config.ts  # Configuração do Tailwind CSS
└── index.html          # Página inicial
```

## 🔐 Arquivos .env

O projeto utiliza variáveis de ambiente para configuração. Você deve criar um arquivo `.env` baseado no arquivo `.env.exemple` fornecido.

## 🚀 Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento na porta 3006
- `npm run build` - Gera a build de produção
- `npm run preview` - Pré-visualiza a build de produção
- `npm run lint` - Executa o ESLint
- `npm run start` - Inicia o servidor de produção

## 🛠️ Tecnologias utilizadas

- React 19.1.0
- React Router DOM 7.6.0
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Themes
- Lucida Icons
- Axios (HTTP Client) Opcional

## 📝 Observações

- O projeto utiliza ESLint para linting
- Configuração de TypeScript está disponível em `tsconfig.json`
- Utiliza Vite como bundler
- Integração com Tailwind CSS para estilização
