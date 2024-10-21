'use strict';

require('../common');
const { spawnSyncAndAssert } = require('../common/child_process');
const { fixturesDir } = require('../common/fixtures');

const warningRE = /ExperimentalWarning: Support for loading ES Module in require/;
function testPreload(preloadFlag) {
  // The warning is only emitted when ESM is loaded by --require.
  const stderr = preloadFlag !== '--import' ? warningRE : undefined;

  // Test named exports.
  {
    spawnSyncAndAssert(
      process.execPath,
      [
        '--experimental-require-module',
        preloadFlag,
        './es-module-loaders/module-named-exports.mjs',
        './printA.js',
      ],
      {
        cwd: fixturesDir
      },
      {
        stdout: 'A',
        stderr,
        trim: true,
      }
    );
  }

  // Test ESM that import ESM.
  {
    spawnSyncAndAssert(
      process.execPath,
      [
        '--experimental-require-module',
        preloadFlag,
        './es-modules/import-esm.mjs',
        './printA.js',
      ],
      {
        cwd: fixturesDir
      },
      {
        stderr,
        stdout: /^world\s+A$/,
        trim: true,
      }
    );
  }

  // Test ESM that import CJS.
  {
    spawnSyncAndAssert(
      process.execPath,
      [
        '--experimental-require-module',
        preloadFlag,
        './es-modules/cjs-exports.mjs',
        './printA.js',
      ],
      {
        cwd: fixturesDir
      },
      {
        stdout: /^ok\s+A$/,
        stderr,
        trim: true,
      }
    );
  }

  // Test ESM that require() CJS.
  // Can't use the common/index.mjs here because that checks the globals, and
  // -r injects a bunch of globals.
  {
    spawnSyncAndAssert(
      process.execPath,
      [
        '--experimental-require-module',
        preloadFlag,
        './es-modules/require-cjs.mjs',
        './printA.js',
      ],
      {
        cwd: fixturesDir
      },
      {
        stdout: /^world\s+A$/,
        stderr,
        trim: true,
      }
    );
  }
}

testPreload('--require');
testPreload('--import');

// Test "type": "module" and "main" field in package.json, this is only for --require because
// --import does not support extension-less preloads.
{
  spawnSyncAndAssert(
    process.execPath,
    [
      '--experimental-require-module',
      '--require',
      './es-modules/package-type-module',
      './printA.js',
    ],
    {
      cwd: fixturesDir
    },
    {
      stdout: /^package-type-module\s+A$/,
      stderr: warningRE,
      trim: true,
    }
  );
}
