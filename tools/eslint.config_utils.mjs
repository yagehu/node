import { createRequire } from 'node:module';

export const requireEslintTool = createRequire(new URL('./node_modules/eslint/', import.meta.url));
export const resolveEslintTool = (request) => requireEslintTool.resolve(request);

export const noRestrictedSyntaxCommonAll = [
  {
    selector: "CallExpression[callee.name='setInterval'][arguments.length<2]",
    message: '`setInterval()` must be invoked with at least two arguments.',
  },
  {
    selector: 'ThrowStatement > CallExpression[callee.name=/Error$/]',
    message: 'Use `new` keyword when throwing an `Error`.',
  },
  {
    selector: "CallExpression[callee.property.name='substr']",
    message: 'Use String.prototype.slice() or String.prototype.substring() instead of String.prototype.substr()',
  },
];

export const noRestrictedSyntaxCommonLib = [
  {
    selector: "CallExpression[callee.name='setTimeout'][arguments.length<2]",
    message: '`setTimeout()` must be invoked with at least two arguments.',
  },
];

export const noRestrictedSyntaxCommonTest = [
  {
    // TODO(@panva): move this to no-restricted-properties
    // when https://github.com/eslint/eslint/issues/16412 is fixed.
    selector: "Identifier[name='webcrypto']",
    message: 'Use `globalThis.crypto`.',
  },
];
