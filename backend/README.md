# Web Project Around Express (Back-end)

## Descrição

API RESTful construída com Node.js, Express e MongoDB para o projeto **Around the US**. Permite cadastro e autenticação de usuários (via JWT), gerenciamento de perfil e avatar, além de criação, listagem, curtida e exclusão de cartões de fotos.

## Funcionalidades

- Cadastro (`/signup`) e login (`/signin`) com hash de senha (bcrypt) e token JWT (expira em 7 dias)
- Autorização por middleware: todas as rotas, exceto `/signin` e `/signup`, exigem token válido
- Perfil do usuário: leitura, atualização de nome/descrição e de avatar (somente do próprio usuário)
- Cartões: listagem, criação, curtida/descurtida e remoção (somente pelo autor do cartão)
- Validação de corpo e parâmetros de requisição com `celebrate`/`Joi`
- Tratamento de erros centralizado, com classes de erro por status HTTP (400, 401, 403, 404, 409, 500)
- Logs de requisições (`request.log`) e de erros (`error.log`) com Winston
- Rota `/crash-test` para simular queda do processo (usada para validar recuperação automática do servidor em produção, ex.: via gerenciador de processos)

## Tecnologias e Técnicas

- **Node.js** — ambiente de execução JavaScript no servidor
- **Express** — framework web para criação das rotas e middlewares
- **MongoDB** — banco de dados NoSQL para persistência dos dados
- **Mongoose** — ODM para modelagem e validação dos dados
- **JWT (jsonwebtoken)** — autenticação por token
- **bcryptjs** — hash de senhas
- **celebrate / Joi** — validação de esquemas de requisição
- **Winston / express-winston** — logs de requisições e erros
- **ESLint (Airbnb)** — padronização de estilo de código
- **Nodemon** — reinicialização automática do servidor em desenvolvimento

## Estrutura do projeto

```
backend/
├── controllers/
│   ├── cards.js
│   └── users.js
├── models/
│   ├── card.js
│   └── user.js
├── middlewares/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validators.js
├── errors/
│   ├── BadRequestError.js
│   ├── ConflictError.js
│   ├── ForbiddenError.js
│   ├── NotFoundError.js
│   ├── UnauthorizedError.js
│   ├── CustomError.js
│   └── index.js
├── routes/
│   ├── cards.js
│   ├── users.js
│   └── index.js
├── utils/
│   └── errors.js
├── .editorconfig
├── .eslintrc
├── .env            # não versionado — veja "Variáveis de ambiente"
├── .gitignore
├── app.js
├── package.json
└── README.md
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do back-end (ele já está no `.gitignore` e nunca deve ser commitado):

```
PORT=3000
JWT_SECRET=uma-string-longa-e-aleatoria-gerada-por-voce
```

Em desenvolvimento (`NODE_ENV !== 'production'`), o servidor funciona normalmente mesmo sem o `.env`, usando um segredo padrão apenas para testes locais. **Em produção, o `JWT_SECRET` real deve sempre vir do `.env`.**

## Como rodar

```bash
# Instalar dependências
npm install

# Iniciar em produção
npm run start

# Iniciar em desenvolvimento (com auto-reload)
npm run dev
```

> Certifique-se de ter o MongoDB rodando localmente em `mongodb://127.0.0.1:27017`.

## Rotas disponíveis

### Autenticação (públicas)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/signup` | Cria um novo usuário |
| POST | `/signin` | Autentica e retorna o token JWT |

### Usuários (protegidas)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/users` | Retorna todos os usuários |
| GET | `/users/me` | Retorna o usuário autenticado |
| GET | `/users/:userId` | Retorna um usuário por ID |
| PATCH | `/users/me` | Atualiza nome e descrição |
| PATCH | `/users/me/avatar` | Atualiza o avatar |

### Cartões (protegidas)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/cards` | Retorna todos os cartões |
| POST | `/cards` | Cria um novo cartão |
| DELETE | `/cards/:cardId` | Deleta um cartão (somente o autor) |
| PUT | `/cards/:cardId/likes` | Curte um cartão |
| DELETE | `/cards/:cardId/likes` | Remove curtida de um cartão |

Todas as rotas acima, exceto `/signup` e `/signin`, exigem o cabeçalho `Authorization: Bearer <token>`.
