# @ax-ui/react

Accessibility-first React component primitives. Correct, tested, low-dependency.

[![CI](https://github.com/your-org/ax-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/ax-ui/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@ax-ui/react)](https://www.npmjs.com/package/@ax-ui/react)

## Install

```bash
pnpm add @ax-ui/react
```

Requires React 19+. ESM-only.

## Quickstart

```tsx
import { Dialog } from '@ax-ui/react/dialog';
import '@ax-ui/react/themes/default.css';

function App() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Hello</Dialog.Title>
        <Dialog.Description>This is accessible by default.</Dialog.Description>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

### Headless vs Styled

```tsx
// Headless: logic + ARIA + classNames only (bring your own styles)
import { Dialog } from '@ax-ui/react/headless';

// Styled: includes default CSS with CSS custom properties
import { Dialog } from '@ax-ui/react/styled';
```

## Components

| Primitive | WAI-ARIA Pattern | Bundle (gzipped) |
|-----------|-----------------|-------------------|
| Dialog | [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | ~2.4 kB |
| Popover | [Dialog (Non-modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | ~2.1 kB |
| Tooltip | [Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) | ~1.4 kB |
| Menu | [Menu](https://www.w3.org/WAI/ARIA/apg/patterns/menu/) | ~2.6 kB |
| Tabs | [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) | ~1.8 kB |
| Toast | [Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) | ~2.2 kB |
| Combobox | [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) | ~3.1 kB |
| Toggle/Switch | [Switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) | ~1.2 kB |
| Accordion | [Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) | ~1.9 kB |
| VisuallyHidden | — | ~0.3 kB |

## Theming

All visual properties are exposed via CSS custom properties under the `--ax-*` prefix:

```css
:root {
  --ax-color-primary: #228be6;
  --ax-color-bg: #ffffff;
  --ax-color-fg: #212529;
  --ax-radius-md: 6px;
  /* ... see themes/default.css for the full list */
}
```

Two themes are shipped:
- `@ax-ui/react/themes/default.css` — Light theme
- `@ax-ui/react/themes/dark.css` — Dark theme (apply via `data-theme="dark"` or `.ax-dark` class)

## API Design

All components use the **compound component** pattern:

```tsx
<Dialog.Root>
  <Dialog.Trigger>...</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>...</Dialog.Title>
    <Dialog.Description>...</Dialog.Description>
    <Dialog.Close>...</Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
```

### Key principles:
- **`asChild` prop** on Trigger components for composition
- **Forwarded refs** on all components
- **Context-based state** — no prop drilling
- **Controlled & uncontrolled** — all stateful components support both modes

## Accessibility Test Matrix

| Component | jest-axe | Keyboard (RTL) | Playwright E2E | Focus Management |
|-----------|----------|----------------|----------------|------------------|
| Dialog | ✅ | ✅ Escape close | ✅ | Focus trap |
| Popover | ✅ | ✅ Escape close | — | Return focus |
| Tooltip | ✅ | ✅ Focus show | — | — |
| Menu | ✅ | ✅ Arrow nav, Enter select, Escape close | ✅ | Roving tabindex |
| Tabs | ✅ | ✅ Arrow nav, Home/End | ✅ | Roving tabindex |
| Toast | ✅ | ✅ Dismiss | — | Live region |
| Combobox | ✅ | ✅ Arrow nav, Enter select, Escape | ✅ | activedescendant |
| Toggle | ✅ | ✅ Space/Enter | — | — |
| Accordion | ✅ | ✅ Expand/collapse | — | — |
| VisuallyHidden | ✅ | — | — | — |

## Deliberately Did Not Use

| Library | Reason |
|---------|--------|
| Radix UI | The point is to demonstrate building correct primitives from scratch |
| React Aria / Headless UI | Same as above — this is a from-scratch implementation |
| CSS-in-JS (Emotion, Stitches, styled-components) | Runtime cost; CSS custom properties provide theming without JS overhead |
| Tailwind CSS | Consumers bring their own styling system; library uses CSS custom properties |
| Animation libraries | Keeps bundle minimal; consumers add animations via CSS transitions/keyframes |

## Project Structure

```
packages/
  ax-ui/
    src/
      dialog/        # Dialog primitive
      popover/       # Popover primitive
      tooltip/       # Tooltip primitive
      menu/          # Menu primitive
      tabs/          # Tabs primitive
      toast/         # Toast primitive
      combobox/      # Combobox primitive
      toggle/        # Toggle + Switch primitives
      accordion/     # Accordion primitive
      visually-hidden/
      utils/         # Shared utilities (context, focus, hooks)
      themes/        # CSS custom property themes
    e2e/             # Playwright integration tests
    package.json
    tsup.config.ts
apps/
  docs/              # Storybook (deployed as live spec)
```

## Development

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build

# Run unit tests
pnpm test

# Run Playwright tests
pnpm test:e2e

# Type check
pnpm typecheck

# Check bundle sizes
pnpm size-limit

# Start Storybook
pnpm storybook
```

## Versioning Policy

- Strict semver — no breaking changes outside major bumps
- Changesets-driven CHANGELOG for every PR
- All changes require passing CI: `typecheck`, `test`, `build`, `size-limit`
- Pre-1.0: API may change between minor versions (documented in CHANGELOG)
- Post-1.0: Breaking changes only in major versions with migration guides

## CI Pipeline

Every PR runs:
1. **Lint & Typecheck** — ESLint + `tsc --noEmit`
2. **Unit & A11y Tests** — Jest + React Testing Library + jest-axe
3. **Playwright E2E** — Keyboard interaction tests
4. **Build & Size Check** — tsup build + size-limit budget enforcement

On merge to `main`:
- Changesets publishes to npm (if changeset is present)
- Storybook deploys to Cloudflare Pages

## License

MIT
