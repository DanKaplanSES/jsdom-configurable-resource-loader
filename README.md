# Node ESM Loader Error

## Reproduce the error

    npm install && npm run build && npm run test

## The error message

```
> jasmine --config="spec/support/jasmine-spec.json"

TypeError: Cannot read properties of undefined (reading 'async')
    at ModuleLoader.importSyncForRequire (node:internal/modules/esm/loader:306:22)
    at loadESMFromCJS (node:internal/modules/cjs/loader:1411:24)
    at Module._compile (node:internal/modules/cjs/loader:1544:5)
    at node:internal/modules/cjs/loader:1699:10
    at Object.require.extensions.<computed> [as .ts] (C:\IdeaProjects\jsdom-configurable-resource-loader\node_modules\ts-node\src\index.ts:1608:43)
    at Module.load (node:internal/modules/cjs/loader:1313:32)
    at Function._load (node:internal/modules/cjs/loader:1123:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:217:24)
    at Module.require (node:internal/modules/cjs/loader:1335:12)
```