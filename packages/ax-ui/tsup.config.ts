import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    headless: 'src/headless.ts',
    styled: 'src/styled.ts',
    'dialog/index': 'src/dialog/index.ts',
    'popover/index': 'src/popover/index.ts',
    'tooltip/index': 'src/tooltip/index.ts',
    'menu/index': 'src/menu/index.ts',
    'tabs/index': 'src/tabs/index.ts',
    'toast/index': 'src/toast/index.ts',
    'combobox/index': 'src/combobox/index.ts',
    'toggle/index': 'src/toggle/index.ts',
    'accordion/index': 'src/accordion/index.ts',
    'visually-hidden/index': 'src/visually-hidden/index.ts',
  },
  format: ['esm'],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
