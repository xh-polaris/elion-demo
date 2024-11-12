module.exports = {
  extends: ['react-app'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'off'
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        'react-hooks/exhaustive-deps': 'warn'
      }
    }
  ]
} 