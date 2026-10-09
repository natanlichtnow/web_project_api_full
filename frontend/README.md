# Around the US (Front-end)

Aplicação React (Vite) do projeto Around the US. Veja a descrição completa do projeto, funcionalidades e tecnologias no [README da raiz](../README.md).

## Como rodar

```bash
npm install
npm run dev
```

Por padrão a aplicação consome a API em `http://localhost:3000`. Para apontar para outra URL (por exemplo, o back-end publicado em produção), copie `.env.example` para `.env` e defina `VITE_API_URL`.

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — gera a versão de produção em `dist/`
- `npm run preview` — serve a build de produção localmente
- `npm run lint` — roda o ESLint
