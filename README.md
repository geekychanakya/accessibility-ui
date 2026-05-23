# ax-ui

Accessibility-first React component primitives — correct, tested, and low-dependency.

This repository is a **pnpm monorepo** that ships [`@ax-ui/react`](./packages/ax-ui) on npm and hosts a **Storybook** docs site for interactive examples and accessibility specs.

## Packages

| Path | Name | Description |
|------|------|-------------|
| [`packages/ax-ui`](./packages/ax-ui) | `@ax-ui/react` | Component library (ESM, tree-shakable) |
| [`apps/docs`](./apps/docs) | `docs` | Storybook 8 component lab |

**Consumer documentation** (install, API, theming, bundle sizes): see [packages/ax-ui/README.md](./packages/ax-ui/README.md).

## Prerequisites

- **Node.js 20+**
- **pnpm 9.15.4** (matches `packageManager` in root `package.json`)

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
```

## Getting started

```bash
git clone <your-repo-url>
cd ax-ui
pnpm install
pnpm build    # required before Storybook (workspace package resolves dist/)
```

## Scripts

Run from the **repository root**:

| Command | Description |
|---------|-------------|
| `pnpm storybook` | Start Storybook at http://localhost:6006 |
| `pnpm dev` | Alias for `pnpm storybook` |
| `pnpm build` | Build `@ax-ui/react` |
| `pnpm typecheck` | TypeScript check (`packages/ax-ui`) |
| `pnpm test` | Jest unit + jest-axe tests |
| `pnpm test:e2e` | Playwright keyboard flows (starts Storybook) |
| `pnpm size-limit` | Enforce per-primitive bundle budgets |
| `pnpm changeset` | Add a Changeset for semver releases |

### Package-level scripts

```bash
# Watch-rebuild the library while developing
pnpm --filter @ax-ui/react dev

# Build static Storybook (same output as Cloudflare deploy)
pnpm --filter docs build-storybook
```

### E2E tests

Playwright installs browsers on first run:

```bash
pnpm build
pnpm --filter @ax-ui/react exec playwright install --with-deps
pnpm test:e2e
```

## Repository layout

```
ax-ui/
├── packages/ax-ui/     # @ax-ui/react source, tests, e2e
├── apps/docs/          # Storybook stories + config
├── .github/workflows/  # CI, release, Storybook deploy
└── .changeset/         # Changesets config
```

## Components

Dialog, Popover, Tooltip, Menu, Tabs, Toast, Combobox, Toggle/Switch, Accordion, and VisuallyHidden — each built to the relevant [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) pattern without Radix, React Aria, or Headless UI.

## CI & deployment

On every PR to `main`:

- Typecheck
- Unit tests + `jest-axe`
- Playwright E2E (Dialog, Menu, Combobox, Tabs)
- Build + `size-limit`

On push to `main`:

- **npm** — Changesets opens a version PR or publishes `@ax-ui/react`
- **Docs** — Storybook static site deploys to Cloudflare Pages (`deploy-storybook.yml`)

Required secrets for deploy: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Required for npm publish: `NPM_TOKEN`.

## Tech stack

- React 19, TypeScript (strict), tsup, Vite (Storybook)
- Jest + React Testing Library + jest-axe
- Playwright (keyboard integration tests)
- Changesets (semver + CHANGELOG)
- pnpm workspaces

## Versioning

Strict semver via [Changesets](https://github.com/changesets/changesets). Add a changeset when your PR changes the public API:

```bash
pnpm changeset
```

## License

MIT — see [LICENSE](./LICENSE).
