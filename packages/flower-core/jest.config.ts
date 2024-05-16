export default {
  displayName: 'flower-core',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json'
        // diagnostics: false // Ignore type errors in tests
      }
    ]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/flower-core',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
}
