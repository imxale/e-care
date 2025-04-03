module.exports = {
  extends: '../.eslintrc.js',
  rules: {
    // Désactiver les règles qui causent des problèmes dans les tests
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    '@typescript-eslint/prefer-namespace-keyword': 'off',
    'prefer-const': 'warn',
  },
  overrides: [
    {
      files: ['**/*.test.ts'],
      rules: {
        // Règles spécifiques pour les fichiers de test
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      }
    }
  ]
}; 