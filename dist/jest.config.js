"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
exports.default = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Add the following lines
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};
//# sourceMappingURL=jest.config.js.map