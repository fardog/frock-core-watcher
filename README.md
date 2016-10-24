# frock-core-watcher

A file-watching reload core plugin for [frock][].

[![Build Status](http://img.shields.io/travis/fardog/frock-core-watcher/master.svg?style=flat-square)](https://travis-ci.org/fardog/frock-core-watcher)
[![npm install](http://img.shields.io/npm/dm/frock-core-watcher.svg?style=flat-square)](https://www.npmjs.org/package/frock-core-watcher)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

## Quick-Start Example

The plugin can watch a list of files or directories, and reload frock when
changes are detected in any of them. To get started, add it to your project's
`package.json`:

```json
{
  "name": "frock-reload-test-project",
  "version": "0.0.0",
  "dependencies": {
    "frock": "^2.0.0",
    "frock-core-watcher": "^1.0.0"
  },
  "frock": {
    "cores": [
      {
        "handler": "frock-core-watcher",
        "options": {
          "watch": ["./mocks/**/*.js"],
          "chokidarOptions": {
            "usePolling": true
          },
          "watchFrockfile": true
        }
      }
    ]
  }
}
```

Then use frock as normal. It will reload based on your list of watched files.

### Reloading on Config File changes

You may wish to have frock reload its configuration when a file changes. This is
accomplished in the above example; if you pass the option `watchFrockfile` the
loaded `frockfile` will be added to the watchlist, and config will be reloaded
when it changes.

### Watch Options

`frock-core-watcher` uses [chokidar][] for file watching; you may pass any
options straight through to chokidar with the `chokidarOptions` key.

## Testing

From the project directory:

```shell
$ npm test
```

## License

Apache 2.0, see [LICENSE](./LICENSE) for details.

[frock]: https://github.com/urbanairship/frock
[chokidar]: https://www.npmjs.com/package/chokidar
