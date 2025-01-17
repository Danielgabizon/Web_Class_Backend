/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Add the following lines
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};