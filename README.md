# Smart HAS — Painel Administrativo (medstock-webapp)

Painel web em Angular para o sistema de estoque hospitalar Smart HAS,
consumindo a mesma API REST usada pelo aplicativo móvel
(`HospitalManagement_Back`, Spring Boot, JWT).

## Rodando localmente

1. Suba a API primeiro: em `HospitalManagement_Back`, rode `./mvnw spring-boot:run`
   (porta padrão `8080`). O CORS já libera `http://localhost:4200`.
2. Neste projeto: `npm install` e depois `npm start` (equivalente a `ng serve`,
   porta `4200`).
3. Acesse `http://localhost:4200`, cadastre uma conta em `/registro` com um
   e-mail de domínio institucional (lista em `application.yml` da API) e senha
   com 8+ caracteres, depois entre em `/login`.

Para apontar para uma API em outro host/porta, edite `apiUrl` em
`src/environments/environment.development.ts` (dev) ou `environment.ts`
(build de produção).

## Estrutura

- `src/app/core` — modelos TS, serviços HTTP (um por recurso da API),
  autenticação (guards, interceptor), utilitários de erro.
- `src/app/layout/shell` — casca com topbar e menu lateral, sensível ao
  perfil do usuário logado.
- `src/app/features` — uma pasta por tela (dashboard, itens, pedidos,
  fornecedores, alertas, usuários), cada uma com seus próprios testes.
- `src/app/shared/components` — componentes reutilizados entre telas
  (tag de status, diálogo de confirmação, wrapper de gráfico).

---

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npm test
```
