import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import a from 'next/core-web-vitals'

/** @type import('eslint').Linter.Config[] */
export default [
    a,
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
]
