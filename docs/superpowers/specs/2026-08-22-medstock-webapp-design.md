# MedStock Webapp — Admin Dashboard Design

Date: 2026-08-22
Status: Approved for planning

## Goal

Build the Angular administrative dashboard required by "Parte 3: Integração
Web com Angular" of the Smart HAS assignment. It consumes the same REST API
(`HospitalManagement_Back`, Spring Boot, JWT-secured) already used by the
React Native mobile app. Only this repo (`medstock-webapp`) is touched;
backend and mobile app are read-only references.

Rubric requirements this design must satisfy:

- Web panel integrated with the API.
- Components to display/manage Smart HAS system data.
- Angular services using `HttpClient` for API communication.
- Data binding (`{{ }}`, `[ ]`, `( )`, `[( )]`) and directives (`*ngIf`, `*ngFor`).
- At least one functional form with `[(ngModel)]`.
- Simple routing between screens (e.g. `/home`, `/admin`).
- Clear, functional styling with basic visual feedback.

## Non-goals

- No backend or mobile app changes.
- No real-time/WebSocket updates (manual refresh / re-fetch after actions is enough).
- No i18n — UI is pt-BR only, matching the API and mobile app.
- No production deployment config beyond a documented `apiUrl` override.

## Rubric vs. project conventions — resolution

`medstock-webapp/CLAUDE.md` mandates modern Angular (`@if`/`@for`, Signal
Forms, no `ngModel`). The assignment explicitly grades for `*ngIf`,
`*ngFor`, and `[(ngModel)]`. Resolution (user-approved): the assignment's
literal wording wins where it's graded —

- Template-driven forms with `[(ngModel)]` (needs `FormsModule`): Login,
  Registro, Usuário (admin-provisioned), Item create/edit, Fornecedor
  create/edit, quantity-adjustment dialog, and list search boxes.
- `*ngIf` / `*ngFor` used for role gating, loading/empty/error states, and
  list/table row rendering in dashboard widgets and nav.
- Everything else (services, guards, interceptors, app-level state) stays
  modern Angular: signals, `inject()`, standalone components, lazy-loaded
  routes — per the existing CLAUDE.md and general senior-Angular practice.

## Backend API reference (as consumed)

Base URL: `http://localhost:8080/api/v1`. CORS already allows
`http://localhost:4200` — no backend change needed for local dev.

Auth: `POST /auth/registro` and `POST /auth/login` are public; every other
endpoint requires `Authorization: Bearer <jwt>`. `POST /auth/refresh` and
`GET /auth/me` operate on the current token. Roles: `ADMIN`, `GESTOR`,
`FARMACEUTICO`, `ENFERMEIRO`. Role-gated operations (server-enforced via
`@PreAuthorize`, mirrored here only for UX/hiding controls):

| Route | Roles |
|---|---|
| `POST`/`PUT /itens` | ADMIN, GESTOR, FARMACEUTICO |
| `POST /pedidos`, `POST /pedidos/{id}/confirmar` | ADMIN, GESTOR, FARMACEUTICO |
| `POST /previsoes/{itemId}/gerar` | ADMIN, GESTOR, FARMACEUTICO |
| `PATCH /pedidos/{id}/status` | ADMIN, GESTOR |
| `POST`/`PUT /fornecedores` | ADMIN, GESTOR |
| `POST /alertas`, `POST /alertas/gerar` | ADMIN, GESTOR |
| `DELETE` (item, fornecedor, alerta) | ADMIN |

Resources and key operations:

- **Itens** (`/itens`): `GET` (filters `status`, `categoria`, `busca`,
  `page`, `size` → `PaginaResponse<ItemResponse>`), `GET /criticos`,
  `GET /vencendo`, `GET /{id}`, `POST`, `PUT /{id}`,
  `PATCH /{id}/quantidade` (stock entrada/saída), `DELETE /{id}`. `status`
  is server-computed, never sent.
- **Pedidos** (`/pedidos`): `GET` (filters `status`, `fornecedorId`),
  `GET /atrasados`, `GET /{id}`, `POST`, `PATCH /{id}/status`,
  `POST /{id}/confirmar` (only path to `ENTREGUE`, adds stock).
- **Fornecedores** (`/fornecedores`): `GET`, `GET /{id}`, `POST`,
  `PUT /{id}`, `DELETE /{id}` (soft — sets `ativo=false`).
- **Alertas** (`/alertas`): `GET` (filters `tipo`, `severidade`, `status`),
  `GET /{id}`, `POST`, `POST /gerar` (auto-scan), `PATCH /{id}/resolver`,
  `PATCH /{id}/ignorar`, `DELETE /{id}`.
- **Previsões** (`/previsoes`): `GET /{itemId}`, `POST /{itemId}/gerar`.
- **Dashboard**: `GET /dashboard/resumo` → stock summary, today's orders,
  recent alerts.
- **Auth**: `POST /registro`, `POST /login`, `POST /refresh`, `GET /me`.

Error contract: validation errors are 400 with a `campos: {campo, erro}[]`
array (map directly onto form fields); 404 = bad id in the URL, 422 = bad
reference/state in the body. `ErroResponse` also carries `status`, `erro`,
`mensagem`, `timestamp`, `path`.

Enums to mirror as TS union types: `StatusItem`, `TipoItem`, `StatusPedido`,
`StatusAlerta`, `TipoAlerta`, `SeveridadeAlerta`, `PerfilUsuario`,
`TipoMovimentacao`.

## Architecture

### Routing

```
''                      → redirect to /home
/login                  public
/registro               public
/home                   dashboard (protected)
/admin                  shell, protected, redirects to /admin/itens
  /admin/itens
  /admin/itens/novo
  /admin/itens/:id
  /admin/pedidos
  /admin/pedidos/novo
  /admin/pedidos/:id
  /admin/fornecedores
  /admin/fornecedores/novo
  /admin/fornecedores/:id
  /admin/alertas
  /admin/usuarios        (ADMIN only — canMatch role check)
**                     → redirect to /home
```

All feature routes lazy-load via `loadChildren`/`loadComponent`. A
functional `authGuard` (`CanActivateFn`) blocks `/home` and `/admin/**`
without a valid session, redirecting to `/login` with a `returnUrl` query
param. A functional `adminGuard` (`CanMatchFn`) gates `/admin/usuarios` to
`PerfilUsuario.ADMIN`.

### Folder structure (feature-based, per senior Angular conventions)

```
src/app/
  core/
    auth/            auth.service.ts, auth.guard.ts, admin.guard.ts, auth.interceptor.ts
    models/          item.ts, pedido.ts, fornecedor.ts, alerta.ts, usuario.ts,
                      dashboard.ts, previsao.ts, pagina.ts, erro.ts, enums.ts
    services/        item.service.ts, pedido.service.ts, fornecedor.service.ts,
                      alerta.service.ts, previsao.service.ts, dashboard.service.ts
    ui/              toast.service.ts (thin wrapper over PrimeNG MessageService)
  layout/
    shell/           shell.ts (topbar + sidenav host, <router-outlet>)
    sidenav/
    topbar/
  features/
    auth/            login/, registro/
    dashboard/       (the /home screen)
    itens/           lista/, form/, ajuste-quantidade/
    pedidos/         lista/, detalhe/, form/
    fornecedores/    lista/, form/
    alertas/         lista/
    usuarios/        form/   (admin-only)
  shared/
    components/      status-tag/, empty-state/, confirm-dialog wrapper (if needed)
    pipes/           (only if a genuine transform is reused; avoid pipes for one-off formatting)
  app.routes.ts
  app.config.ts
```

Each feature folder only depends on `core` and `shared` — never on another
feature — keeping units independently understandable, per the project's
existing component-boundary guidance.

### State & data flow

- `AuthService` (root-provided) holds `token` and `usuario` as signals,
  persisted to `localStorage`; exposes `isAuthenticated` and `perfil` as
  `computed()`. `login()`/`registrar()`/`logout()` call `AuthService`'s
  own `HttpClient` calls to `/auth/*`.
- Resource services (`ItemService`, etc.) are thin: one method per
  endpoint, `HttpClient` + `inject()`, typed `Observable<T>` returns, no
  caching layer — components own their own loading/error signals per
  screen (kept simple; no global store, since the API is the source of
  truth and there's no cross-screen shared mutable state beyond auth).
- List screens hold `items = signal<T[]>([])`, `loading = signal(false)`,
  `error = signal<string | null>(null)`, `pagina = signal(0)` etc., fetch
  in `effect()`/on init and on filter change, `*ngFor` over the signal's
  current value read in the template.
- Functional `authInterceptor` attaches the bearer token from
  `AuthService`; on `401` it calls `logout()` and navigates to `/login`.

### Visual design

PrimeNG (unstyled/Aura preset) + Tailwind v4 (already installed) for
layout/spacing utilities. Dark theme reusing the mobile app's palette
(`HospitalManagement-ReactNative/src/theme/colors.ts`) for brand
consistency across web/mobile: primary `#534AB7`, danger `#E24B4A`,
warning `#EF9F27`, success `#3B6D11`, info `#185FA5`, background `#121212`
/ card `#1E1E1E`. Status enums map onto these semantic colors via a shared
`status-tag` component (e.g. `CRITICO`→danger, `ATENCAO`→warning,
`NORMAL`/`ENTREGUE`/`RESOLVIDO`→success).

PrimeNG modules used: `Table` (server-driven pagination/filtering, maps
directly onto `PaginaResponse`), `Toast` + `MessageService` (visual
feedback), `Dialog` (create/edit forms, quantity-adjustment), `ConfirmDialog`
(destructive actions), `Chart` (dashboard status distribution, wraps
Chart.js), `Tag`/`Badge` (status), `Menu`/`PanelMenu` (sidenav).

## Screens

- **Login** (`/login`): `[(ngModel)]` email/senha, `(ngSubmit)`, inline
  field errors from `campos[]`, loading state on submit, redirect to
  `returnUrl` or `/home` on success.
- **Registro** (`/registro`): `[(ngModel)]` nome/email/senha (mirrors the
  mobile signup — institutional domain + min-8-char password validated
  client-side *and* server-side).
- **Dashboard** (`/home`): KPI cards (`{{ }}` interpolation) from
  `GET /dashboard/resumo` — total itens, críticos, pedidos atrasados,
  alertas ativos; `*ngFor` lists for "pedidos do dia" and "alertas
  recentes"; a PrimeNG `Chart` (donut) of item status distribution.
- **Itens** (`/admin/itens`): `Table` with filters (status dropdown,
  categoria, busca text bound with `[(ngModel)]`), tabs/chips for
  Críticos / Vencendo (extra queries), row actions edit/delete (`*ngIf`
  role-gated), "Ajustar quantidade" dialog (entrada/saída, `[(ngModel)]`
  quantity + tipo). Create/edit form: full template-driven form with
  `[(ngModel)]` on every field — the rubric's primary functional-form
  showcase.
- **Pedidos** (`/admin/pedidos`): list with status filter + "somente
  atrasados" toggle; detail view listing `itens` of the pedido; actions
  Confirmar (`(click)`, role-gated) and status dropdown (role-gated,
  disallows `ENTREGUE`).
- **Fornecedores** (`/admin/fornecedores`): list with `ativo` `Tag`,
  create/edit form (`[(ngModel)]`), inativar action (confirm dialog).
- **Alertas** (`/admin/alertas`): list with tipo/severidade/status filter
  chips, "Gerar alertas" button (role-gated), resolver/ignorar row
  actions.
- **Usuários** (`/admin/usuarios`, ADMIN only): form to provision an
  institutional account with explicit perfil/departamento/cargo/hospital
  via `POST /auth/registro` called while authenticated.
- **Previsão de demanda**: inline panel on item detail — "Gerar previsão"
  button (`POST /previsoes/{itemId}/gerar`), renders the returned série as
  a small line chart.

## Error handling & feedback

- Global `Toast` (via `MessageService`) for success/error on every
  mutating action.
- Field-level errors: a small `applyCamposErro(form, erro)` util maps the
  API's `campos: {campo, erro}[]` onto per-field error text shown under
  each `[(ngModel)]` input.
- Loading: `ProgressSpinner`/table skeleton while fetching; submit buttons
  show `p-button` loading state and disable during in-flight requests.
- Empty states: shared `empty-state` component for zero-result lists.
- Destructive actions (delete item/fornecedor/alerta, confirmar pedido)
  go through `ConfirmDialog` before firing the request.

## Accessibility & quality bar

Per senior-Angular / market-standard practice: semantic HTML, label/`for`
pairing on every form field (PrimeNG components support this), visible
focus states, sufficient color contrast on the dark theme (verify
critical/warning/success tag colors against WCAG AA), keyboard-operable
dialogs and menus (PrimeNG handles this out of the box), `alt` text via
`NgOptimizedImage` where static images are used. Angular ESLint
(`@angular-eslint`) added if not already present, run in CI-equivalent
local check before considering a feature done.

## Testing

Vitest (already scaffolded). Light but meaningful coverage:

- `AuthService`: login success/failure, token persistence, logout clears
  state.
- `authGuard`/`adminGuard`: redirect behavior.
- One representative form component (Item create/edit): required-field
  validation and `campos[]` error mapping.

No attempt at full coverage — this is a course project, not a production
system; tests exist to prove the integration wiring, not to gate merges.

## Configuration

- `src/environments/environment.ts` (dev) and `environment.development.ts`
  with `apiUrl: 'http://localhost:8080/api/v1'`.
- README section documenting how to point at a different backend host/port
  (edit `environment.ts`) and the `npm start` + backend-must-be-running
  local dev flow.

## Open assumptions

- Backend is run locally on port 8080 during development/grading; no
  additional CORS origin needed since 4200 is already allowlisted.
- `/auth/registro` remains usable both unauthenticated (self-signup, forces
  FARMACEUTICO + institutional defaults) and authenticated-as-admin (full
  fields) — confirmed by `INTEGRACAO.md`, no backend change required.
- PrimeNG's free community components (Table, Dialog, Toast, Chart, Menu,
  ConfirmDialog, Tag) are sufficient; no PrimeNG Pro features needed.
