
module.exports = {
    'env': {
        'es2021': true,
        'node': true,
        'mocha': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
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
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/ban-types': 'off',
        'import/no-unresolved': 'off',
        'eol-last': 'error'
    },
}
