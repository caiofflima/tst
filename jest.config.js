module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/e2e/'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
    '/dist/',
    '.mock.ts'
  ],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$'
      }
    ]
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
    '^sidsc-components/(.*)$': '<rootDir>/node_modules/sidsc-components/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|@angular|@ngrx|rxjs|tslib|ng-dynamic|primeng|quill)'
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment'
  ]
};
