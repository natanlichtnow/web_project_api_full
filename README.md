# Around the US — Projeto Full Stack (React + Node.js/Express + MongoDB)

## Descrição do projeto

**Around the US** é uma aplicação web full stack em que o usuário pode se cadastrar, fazer login e montar seu perfil (nome, descrição e avatar). Depois de autenticado, o usuário pode publicar cartões de fotos de lugares que visitou, curtir cartões de outros usuários e remover apenas os cartões que ele mesmo criou.

O front-end é uma SPA em React responsável pela interface, autenticação (telas de cadastro/login) e navegação. O back-end é uma API REST em Node.js/Express com MongoDB, responsável por autenticação via JWT, validação de dados e regras de autorização (por exemplo, impedir que um usuário edite o perfil ou apague o cartão de outra pessoa).

> ⚠️ **Preencha antes de entregar:** substitua os itens abaixo pelos dados reais do seu projeto.

- **URL do aplicativo:** `https://SEU-DOMINIO.students.nomoreparties.sbs`
- **URL da API (back-end):** `https://api.SEU-DOMINIO.students.nomoreparties.sbs`
- **Capturas de tela / GIFs:** adicione aqui imagens mostrando as telas de login, cadastro, feed de cartões e edição de perfil.
- **Vídeo de demonstração:** adicione aqui o link do vídeo mostrando o projeto em funcionamento.

## Funcionalidades

- Cadastro de novo usuário (e-mail e senha)
- Login com geração de token JWT (válido por 7 dias)
- Sessão persistida no navegador (o usuário continua logado ao recarregar a página)
- Visualização e edição do perfil (nome e descrição)
- Atualização do avatar do usuário
- Listagem de todos os cartões cadastrados
- Criação de novos cartões (nome + link da imagem)
- Curtir e descurtir cartões
- Exclusão de cartões — somente pelo próprio autor do cartão
- Validação de formulários no front-end e de dados no back-end
- Tratamento centralizado de erros, com respostas HTTP padronizadas (400, 401, 403, 404, 409, 500)
- Registro de logs de requisições e de erros (`request.log` e `error.log`)

## Tecnologias e técnicas utilizadas

**Front-end**
- React 19 + Vite
- React Router (navegação e rotas protegidas por autenticação)
- Context API (dados do usuário atual compartilhados entre componentes)
- Fetch API para comunicação com o back-end
- Metodologia BEM para nomenclatura de classes CSS
- ESLint para padronização de código

**Back-end**
- Node.js + Express
- MongoDB + Mongoose (modelagem e validação de dados)
- JSON Web Token (`jsonwebtoken`) para autenticação
- `bcryptjs` para hash de senhas
- `celebrate`/`Joi` para validação de esquemas de requisição
- Winston + `express-winston` para logs de requisições e erros
- Tratamento de erros customizado (classes de erro por status HTTP)
- ESLint (Airbnb base) para padronização de código

## Estrutura do repositório

```
web_project_api_full/
├── backend/     # API REST (Express + MongoDB)
└── frontend/    # Aplicação React (Vite)
```

Consulte o README de cada pasta para instruções específicas de execução:
- [backend/README.md](./backend/README.md)
- [frontend/README.md](./frontend/README.md)

## Como rodar o projeto localmente

### Pré-requisitos
- Node.js instalado
- MongoDB rodando localmente na porta padrão (`27017`)

### Back-end
```bash
cd backend
npm install
npm run dev
```
O servidor sobe por padrão em `http://localhost:3000`.

### Front-end
```bash
cd frontend
npm install
npm run dev
```
A aplicação sobe por padrão em `http://localhost:5173` e já está configurada para consumir a API em `http://localhost:3000`. Para apontar para outra URL (por exemplo, em produção), crie um arquivo `.env` na pasta `frontend` com base em `.env.example` e defina `VITE_API_URL`.

## Rotas da API

### Autenticação (públicas)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/signup` | Cria um novo usuário (nome, sobre, avatar, e-mail, senha) |
| POST | `/signin` | Autentica o usuário e retorna o token JWT |

### Usuários (protegidas — requerem token JWT)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/users` | Retorna todos os usuários |
| GET | `/users/me` | Retorna os dados do usuário autenticado |
| GET | `/users/:userId` | Retorna um usuário pelo ID |
| PATCH | `/users/me` | Atualiza nome e descrição do perfil |
| PATCH | `/users/me/avatar` | Atualiza o avatar do usuário |

### Cartões (protegidas — requerem token JWT)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/cards` | Retorna todos os cartões |
| POST | `/cards` | Cria um novo cartão |
| DELETE | `/cards/:cardId` | Remove um cartão (somente o autor pode remover) |
| PUT | `/cards/:cardId/likes` | Curtir um cartão |
| DELETE | `/cards/:cardId/likes` | Remover curtida de um cartão |

Todas as rotas, exceto `/signin` e `/signup`, exigem o cabeçalho `Authorization: Bearer <token>`.

## Tratamento de erros

Em caso de erro, a API responde com o status HTTP correspondente e um corpo `{ "message": "..." }`:

- `400` — dados inválidos no corpo da requisição
- `401` — token ausente, inválido ou credenciais incorretas
- `403` — tentativa de remover cartão de outro usuário
- `404` — usuário/cartão não encontrado ou rota inexistente
- `409` — e-mail já cadastrado
- `500` — erro interno do servidor
