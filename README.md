# Jogo de Adivinhação

Aplicação fullstack para adivinhar um número aleatório entre 1 e 100, desenvolvida em .NET (backend) e React (frontend).

---

## 📋 Sobre o Projeto

O usuário deve tentar adivinhar o número inteiro sorteado pelo sistema. A cada tentativa, o sistema informa se o número informado é maior ou menor que o sorteado. Ao acertar, o usuário é informado e pode iniciar uma nova rodada.

---

## 🚀 Tecnologias

- **Backend:** .NET 9 (ASP.NET Core)
- **Frontend:** React + Vite
- **Linguagens:** C#, JavaScript, CSS

---

## ⚙️ Como executar

### 1. Clone o repositório

```bash
git clone https://github.com/aulushzp/jogo-adivinhacao.git
cd jogo-adivinhacao
```

### 2. Inicie o backend

```bash
cd backend
dotnet run
```

### 3. Inicie o frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse o frontend em [http://localhost:5173](http://localhost:5173)

---

## 📁 Estrutura

```
jogo-adivinhacao/
├── backend/
│   ├── Controllers/
│   ├── Program.cs
│   └── ...
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── ...
├── .gitignore
└── README.md
```

---

## 📝 Licença

Este projeto está sob a licença MIT.

# Jogo de Adivinhação - Testes Automatizados

Este projeto inclui testes automatizados unitários tanto para o backend (C#) quanto para o frontend (React).

## Estrutura do Projeto

```
qa-jogo-adivinhacao/
├── backend/                 # API .NET Core
│   ├── Controllers/
│   │   └── GameController.cs
│   ├── Backend.Tests.csproj # Projeto de testes do backend
│   ├── GameControllerTests.cs
│   └── TestSettings.json
└── frontend/               # Aplicação React
    ├── src/
    │   ├── App.jsx
    │   ├── App.test.jsx    # Testes do componente App
    │   └── test/
    │       └── setup.js    # Configuração dos testes
    ├── vitest.config.js
    └── package.json
```

## Backend - Testes Unitários (.NET)

### Pré-requisitos
- .NET 9.0 SDK
- Visual Studio ou VS Code

### Executando os Testes

1. Navegue para o diretório do backend:
```bash
cd backend
```

2. Restaure as dependências:
```bash
dotnet restore
```

3. Execute os testes:
```bash
dotnet test
```

4. Para executar com cobertura de código:
```bash
dotnet test --collect:"XPlat Code Coverage"
```

### Testes Implementados

- **Validação de entrada**: Testa números fora do intervalo válido (1-100)
- **Resposta de palpite**: Testa respostas corretas, maiores e menores
- **Contagem de tentativas**: Verifica se as tentativas são incrementadas corretamente
- **Reinicialização do jogo**: Testa a funcionalidade de reiniciar
- **Sessão**: Verifica se a sessão é mantida entre requisições

## Frontend - Testes Unitários (React)

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Executando os Testes

1. Navegue para o diretório do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute os testes:
```bash
npm test
```

4. Para executar com interface visual:
```bash
npm run test:ui
```

5. Para executar com cobertura de código:
```bash
npm run test:coverage
```

### Testes Implementados

- **Renderização**: Verifica se todos os elementos são renderizados corretamente
- **Interação do usuário**: Testa entrada de dados, cliques em botões
- **Validação de entrada**: Verifica se apenas números são aceitos
- **Estados dos botões**: Testa habilitação/desabilitação baseada no estado
- **Chamadas de API**: Mocka e testa todas as chamadas para o backend
- **Tratamento de erros**: Testa cenários de erro de rede e validação
- **Estados de carregamento**: Verifica comportamento durante requisições
- **Reinicialização**: Testa a funcionalidade de nova rodada

## Tecnologias Utilizadas

### Backend
- **xUnit**: Framework de testes
- **Microsoft.AspNetCore.Mvc.Testing**: Para testes de integração
- **Moq**: Para mocking (quando necessário)

### Frontend
- **Vitest**: Runner de testes rápido
- **@testing-library/react**: Utilitários para testar componentes React
- **@testing-library/user-event**: Simulação de interações do usuário
- **@testing-library/jest-dom**: Matchers adicionais para DOM
- **jsdom**: Ambiente DOM para testes

## Cobertura de Testes

Os testes cobrem:

### Backend
- ✅ Validação de entrada
- ✅ Lógica de negócio do jogo
- ✅ Respostas HTTP corretas
- ✅ Gerenciamento de sessão
- ✅ Contagem de tentativas

### Frontend
- ✅ Renderização de componentes
- ✅ Interações do usuário
- ✅ Estados da aplicação
- ✅ Chamadas de API
- ✅ Tratamento de erros
- ✅ Validação de formulários

## Executando Todos os Testes

Para executar todos os testes de uma vez:

```bash
# Backend
cd backend && dotnet test

# Frontend
cd frontend && npm test
```

## Contribuindo

Ao adicionar novas funcionalidades, lembre-se de:

1. Escrever testes unitários para a nova funcionalidade
2. Manter a cobertura de testes acima de 80%
3. Executar todos os testes antes de fazer commit
4. Seguir os padrões de nomenclatura dos testes existentes 