
module.exports = {
    'env': {
        'es2021': true,
        'node': true,
        'mocha': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'rules': {
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        indent: ['error', 4],
    },
}