# Node ESM Loader Error

## Reproduce the error

    npm install && npm run build && npm run test

## The error message

```
> jasmine --config="spec/support/jasmine-spec.json"

Error: Cannot require() ES Module apps\jsdom-configurable-resource-loader\node_modules\entities\src\decode.spec.ts because it is not yet fully loaded. This may be caused by a race condition if the module is simultaneously dynamically import()-ed via Promise.all(). 
Try await-ing the import() sequentially in a loop instead. (from apps\jsdom-configurable-resource-loader\node_modules\jasmine\lib\loader.js)
This is caused by either a bug in Node.js or incorrect usage of Node.js internals.
Please open an issue with this stack trace at https://github.com/nodejs/node/issues

    at Function.fail (node:internal/assert:17:9)
    at ModuleLoader.importSyncForRequire (node:internal/modules/esm/loader:375:16)
    at loadESMFromCJS (node:internal/modules/cjs/loader:1561:24)
    at Module._compile (node:internal/modules/cjs/loader:1712:5)
    at node:internal/modules/cjs/loader:1895:10
    at Object.require.extensions.<computed> [as .ts] (apps\jsdom-configurable-resource-loader\node_modules\ts-node\src\index.ts:1608:43)
    at Module.load (node:internal/modules/cjs/loader:1465:32)
    at Function._load (node:internal/modules/cjs/loader:1282:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:235:24) {
  code: 'ERR_INTERNAL_ASSERTION'
}
```