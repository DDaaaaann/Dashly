// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
      ignores: ['dist/']
    },
    {
      files: ['**/*.ts', '**/*.js'],
      languageOptions: {
        globals: {
          "document": "readonly",
          "setInterval": "readonly",
          "window": "readonly",
          "setTimeout": "readonly",
          "console": "readonly",
          // internal globals
          "Icon": "readonly",
          "lookupTable": "readonly",
          "openUrl": "readonly",
          "replaceSearchTerm": "readonly",
          "isModifierKey": "readonly",
        }
      }
    }
);