import blumilkDefault from '@blumilksoftware/eslint-config'

overrides: [
  {
    files: ['**/*.cjs'],
    parserOptions: {
      sourceType: 'module'
    }
  }
]
export default [...blumilkDefault]
