# JSZip-slim

## NOTE: by no means is this a re-implementation of [JSZip](https://github.com/Stuk/jszip)

This package is aimed at re-packaging JSZip, in order to remove some of the backwards-compatibility and Browser compatibility. This reduces the package size, making it more suitable for packaging with AWS Lambda

### `Promise`

Instead of [`lie`](https://github.com/calvinmetcalf/lie), it uses the native NodeJS `Promise`. Even though the runtime would shake the package with a `try { } catch { }` import, the package would still be installed.

### `Readable`

Instead of ['readable-stream'](https://github.com/nodejs/readable-stream), it uses the native `Readable`.  Even though the runtime would check for native capabilities with a `try { } catch { }` import, the package would still be installed.
