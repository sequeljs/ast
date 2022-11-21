const jsRules = {
  'import/extensions': [
    'error',
    {
      css: 'always',
      json: 'always',
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    },
  ],
  'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: [
        '**/*.config.{js,jsx,ts,tsx}',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/tests/**/*.{js,jsx,ts,tsx}',
      ],
    },
  ],
  'import/prefer-default-export': ['off'],
}

const tsRules = {
  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
}

module.exports = {
  env: {
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: jsRules,
  ignorePatterns: ['dist/**/*'],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
      rules: {
        ...jsRules,
        ...tsRules,
      },
    },
  ],
}
