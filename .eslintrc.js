module.exports = {
  'env': {
    'commonjs': true,
    'es2021': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'no-unused-vars': [
      'warn',
      {
        'vars': 'all',
        'args': 'after-used'
      }
    ],
    'no-case-declarations': 'off',
    'no-trailing-spaces': 'error',
    'no-whitespace-before-property': 'error',
    'keyword-spacing': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
  }
}
