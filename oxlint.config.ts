import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: [
    'eslint',
    'typescript',
    'unicorn',
    'react',
    'react-perf',
    'oxc',
    'import',
    'jsx-a11y',
    'promise',
    'node',
    'nextjs',
  ],
  options: {
    typeAware: true,
    typeCheck: true,
  },
  rules: {
    'react/react-compiler': 'error',
  },
});
