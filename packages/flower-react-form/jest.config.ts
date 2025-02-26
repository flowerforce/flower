export default {
  displayName: 'flower-react-form',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }]
  },
  moduleFileExtensions: ['ts', 'js', 'tsx', 'html'],
  coverageDirectory: '../../coverage/packages/flower-react-form',
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
}
