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