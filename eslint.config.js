import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

const eslintConfig = [...coreWebVitals, ...typescript, eslintConfigPrettier];

export default eslintConfig;
