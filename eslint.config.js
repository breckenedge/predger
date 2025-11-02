export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        caches: 'readonly',
        self: 'readonly',
        clients: 'readonly',
        location: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'multi-line'],
      'no-multi-spaces': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'never'],
      'arrow-spacing': 'error',
      'object-shorthand': 'warn'
    }
  },
  {
    ignores: ['node_modules/**', 'build/**', 'src/**']
  }
];
