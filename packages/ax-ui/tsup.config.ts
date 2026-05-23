import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    styled: 'src/styled.ts',
    'dialog/index': 'src/dialog/index.tsx',
    'popover/index': 'src/popover/index.tsx',
    'tooltip/index': 'src/tooltip/index.tsx',
    'menu/index': 'src/menu/index.tsx',
    'tabs/index': 'src/tabs/index.tsx',
    'toast/index': 'src/toast/index.tsx',
    'combobox/index': 'src/combobox/index.tsx',
    'toggle/index': 'src/toggle/index.tsx',
    'accordion/index': 'src/accordion/index.tsx',
    'visually-hidden/index': 'src/visually-hidden/index.tsx',
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
