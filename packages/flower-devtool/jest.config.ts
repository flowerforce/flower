export default {
  displayName: 'flower-devtool',
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
  coverageDirectory: '../../coverage/packages/flower-devtool',
  coverageProvider: 'v8'
  // setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
}
