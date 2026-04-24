# Todo App Frontend (Angular 17)

Frontend de la prueba técnica construido con Angular 17 + Angular Material.

## Stack

- Angular 17 (standalone components)
- TypeScript
- Angular Material
- RxJS + Signals
- Karma + Jasmine (unit tests)
- Firebase Hosting (deploy)

## Decisiones técnicas

- **Arquitectura:** `features + core + shared` para separar responsabilidades.
  - `core`: servicios, guards, interceptores, modelos, tokens.
  - `features`: pantallas y componentes de negocio (`login`, `home`).
  - `shared`: UI reutilizable (`shared/ui/confirm-dialog`, `shared/ui/empty-state`).
- **Auth:** login solo por email (según reto), sesión en `localStorage` con `AuthService`.
- **Estado de tareas:** `TasksStore` con Signals (`tasks`, `loading`, `error`) + updates optimistas y rollback.
- **Interceptors:**
  - `auth.interceptor`: agrega `x-user-email` para llamadas al API.
  - `error.interceptor`: centraliza feedback de errores.

## Variables de entorno

### Desarrollo (`src/environments/environment.ts`)

```ts
apiBaseUrl: "http://127.0.0.1:5001/todo-app-c933d/us-central1/api"
```

### Producción (`src/environments/environment.prod.ts`)

```ts
apiBaseUrl: "https://api-aobuox2onq-uc.a.run.app"
```

> `angular.json` ya tiene `fileReplacements` para usar `environment.prod.ts` al construir en producción.

## Scripts

```bash
npm run start          # levanta frontend en dev
npm run build          # build por defecto
npm run build:prod     # build de producción
npm run lint           # lint
npm run test           # tests unitarios (watch)
npm run deploy:hosting # build prod + deploy a Firebase Hosting
```

## Correr local contra emuladores

1. Levantar backend/emuladores desde `todo-app-backend`:

```bash
firebase emulators:start
```

2. Levantar frontend:

```bash
npm run start
```

3. Abrir `http://localhost:4200`.

## Correr contra producción (API desplegada)

- Build de producción:

```bash
npm run build:prod
```

- Deploy a Hosting:

```bash
npm run deploy:hosting
```

Al desplegar, el frontend usa `environment.prod.ts`.

## Deploy Firebase Hosting

Este repo incluye:

- `firebase.json` con Hosting apuntando a:
  - `dist/atom-challenge-fe-template/browser`
- `.firebaserc` con proyecto por defecto:
  - `todo-app-c933d`

### Requisitos

- Firebase CLI instalada:

```bash
npm i -g firebase-tools
firebase login
```

## CI opcional (GitHub Actions)

Se agregó workflow en:

- `.github/workflows/deploy.yml`

Flujo:

- Trigger en push a `main`
- `npm ci`
- `npm run build:prod`
- deploy a Firebase Hosting (canal `live`)

Secret requerido en GitHub:

- `FIREBASE_SERVICE_ACCOUNT_TODO_APP_C933D`

## Testing

Suite unitaria con cobertura de:

- `AuthService`
- `UserApiService` y `TaskApiService` (`HttpTestingController`)
- guards (`authGuard`, `guestGuard`)
- `TasksStore` (mocks de servicios)
- componentes principales (`login`, `home`, `task-item`)

Ejecución headless:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```
