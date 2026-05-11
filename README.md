<center><h1> 📓 Good Diary API ⚙️</h1></center>

A API do **Good Diary** consiste em uma API Restful, responsável por fornecer rotas de autenticação e manipulação - CRUD (Create, Read, Update, Delete) - de entidades (usuários e suas notas).

O sistema consiste em um software feito para servir como diário pessoal, onde o usuário pode escrever notas sobre o seu dia, consultá-las, editá-las e excluí-las.

## Ferramentas ✂️

<div style="display: inline-block">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier" />
</div>

## OpenAPI - Scalar 📃

Acesse a documentação - com o projeto rodando na sua máquina - em [`http://localhost:<PORT>/reference`](http://localhost:<PORT>/reference).
Por padrão, a variável `PORT` possui o valor de **3000**.

---

## Configuração Inicial 🛠️

Antes de rodar a aplicação, crie um arquivo `.env` na raiz do projeto e preencha as variáveis abaixo:

```conf
PORT=3000
JWT_KEY="sua_chave_secreta_aqui"

# Configurações do Banco de Dados
DB_PASS=docker
DB_USER=docker
DB_NAME=good_diary_db
DATABASE_URL="postgresql://docker:docker@localhost:5432/good_diary_db?schema=public"
```

**Nota:** Se for rodar os testes E2E, certifique-se de ter um arquivo `.env.test` configurado apontando para o banco de testes.

## Rotas da Aplicação 🪧

### Auth
* **[POST]** `/auth` - Realiza o login e retorna o token JWT.

### User

#### **[POST]** `/user` 
Cria um novo usuário no sistema.

### Note
#### **[POST]** `/note` 
 Cria uma nova nota para o usuário autenticado.

#### **[GET]** `/user/notes`
Retorna todas as notas do usuário logado.

#### **[PUT]** `/notes/{id}` 
Edita uma nota existente com base no ID.

#### **[DELETE]** `/note/{id}`
 Remove uma nota do sistema com base no ID.

## Comandos ⌨️

### 1. Subir os Bancos de Dados (Docker)

```bash
# Banco de desenvolvimento
docker-compose up -d

# Banco de testes (se necessário)
docker-compose -f docker-compose.test.yml --env-file .env.test  up -d
```

### 2. Instalação

```bash
# Instalar dependências
pnpm install

# Gerar Client do Prisma e rodar Migrations
pnpm prisma:generate
pnpm prisma:migrate
```

### 3. Execução

```bash
# Modo desenvolvimento
pnpm start:dev

# Build e Produção
pnpm build
pnpm start:prod
```

## 4. Testes

```bash
# Testes unitários (watch)
pnpm test

# Testes E2E
pnpm test:e2e

# Rodar todos os testes
pnpm test:all
```

<center><small>🦇 Feito com 💜</small></center>