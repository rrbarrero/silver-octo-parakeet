# Project Overview for LLM Agents

## High-Level Architecture
- **Framework**: Next.js 15 (App Router) with React 19 and TypeScript.
- **UI Layer**: Client components orchestrated by React Query, shadcn/ui primitives, Tailwind CSS, and custom design tokens.
- **Domain Layer**: DDD + CQRS separation hosted under `src/domain`, providing entities, value objects, repositories, commands, and queries.
- **Infrastructure**: `src/infrastructure` exposes concrete adapters (Prisma-backed and in-memory repositories) and a lightweight container to share dependencies.
- **API Layer**: Next.js route handlers under `src/app/api` translate HTTP requests into domain commands/queries and serialize responses.
- **Validation**: Zod schemas in `src/lib/validation` guard both API payloads and client forms.
- **Testing**: Vitest covers units (domain + infrastructure) and integration (API handlers).

## Domain Model
- `JobApplication` aggregate captures company, role, optional description, posting URL, applied date, status, and comments.
- Status is constrained by the `ApplicationStatus` value object (`APPLICATION_STATUSES`).
- Command handlers (create, update status, add comment) and query handlers (list, get by id) enforce CQRS boundaries.
- Repository contract defines persistence operations; currently fulfilled by `InMemoryApplicationRepository` which clones data defensively.

## Application Flow
1. Client forms validate inputs with `react-hook-form` + Zod, then call server routes via React Query mutations.
2. API route handlers parse payloads using shared validation schemas and dispatch to domain command handlers.
3. Queries read through the repository and return serialized DTOs; command handlers mutate domain aggregates and persist them via the repo.
4. React Query caches list/detail responses to drive UI widgets (table, detail pane, summary metrics).

## File/Folder Guide
- `src/app` – Next.js app router: layout, providers, UI pages, API routes.
- `src/app/providers.tsx` – Registers React Query client.
- `src/app/api/...` – REST endpoints bridging HTTP to domain services (DDD + CQRS style).
- `src/components` – UI components (applications page, shadcn-based primitives, table, forms).
- `src/domain` – Domain core (entities, value objects, commands, queries, repositories interface).
- `src/infrastructure` – Adapters (Prisma and in-memory persistence, simple container with shared dependencies).
- `src/infrastructure/persistence/PrismaApplicationRepository.ts` – Prisma implementation of the repository contract.
- `src/infrastructure/prismaClient.ts` – Singleton Prisma client with hot-reload safety.
- `src/lib` – Utility helpers (API client wrappers, validation schemas, class name helper).
- `tests/integration` – End-to-end Vitest coverage for route handlers.

## Patterns & Practices
- **DDD & CQRS**: Separate write (command) and read (query) logic with clear boundaries.
- **Dependency Injection**: `applicationModule` container wires repository + handlers; easy to swap persistence implementation.
- **Validation at boundaries**: Server route handlers and client forms reuse Zod schemas to keep constraints consistent.
- **Immutability**: Domain helpers return new aggregates rather than mutating in place; repository clones data on read/write.
- **UI Composition**: Reusable shadcn components customized with Tailwind tokens for consistent styling.

## Testing Strategy
- Unit tests target domain logic (`src/domain/.../*.test.ts`) and infrastructure behind repository behavior.
- Integration tests (`tests/integration/applicationsRoutes.test.ts`) exercise API route handlers end-to-end using the shared container.
- Commands: `npm run lint` for static analysis, `npm run test` for Vitest.

## Agent Workflow Tips
1. When adding or modifying features, update domain logic first, then adjust API handlers and client consumers.
2. Use shared validation schemas for any new payload shape.
3. Update tests alongside code changes; expand integration tests for new endpoints or workflows.
4. After every change or feature addition, run both `npm run lint` and `npm run test`.
5. Remember to maintain Tailwind tokens and shadcn components when introducing new UI elements.
