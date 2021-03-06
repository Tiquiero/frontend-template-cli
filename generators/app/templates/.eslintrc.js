module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    require.resolve('@umijs/fabric/dist/eslint')
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src']
        ]
      }
    },
  },
  rules: {
    'object-curly-newline': 'off',
    'object-shorthand': 'off',
    'no-unused-expressions': ["error", { "allowShortCircuit": true }],
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-param-reassign': 'off',
    'no-return-await': 'off',
    'prefer-destructuring': 'off',
    'consistent-return': 'off',
    'arrow-body-style': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    "no-shadow": "off",
    "import/no-named-as-default": 0,
    "import/no-named-as-default-member": 0,
  },
};
