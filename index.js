var fs = require('fs')

var arrify = require('arrify')
var chokidar = require('chokidar')

module.exports = createWatcherCore

function createWatcherCore (frock, logger, _opts) {
  var opts = _opts || {}
  var watch = arrify(opts.watch || [])
  var chokidarOptions = opts.chokidarOptions || {}
  var frockfilePath = frock.argv.file

  var reloading = false

  if (opts.watchFrockfile) {
    watch.push(frockfilePath)
  }

  chokidar.watch(watch, chokidarOptions).on('all', function (path) {
    if (reloading) return

    reloading = true

    logger.info('reloading on path change: ' + path)

    if (opts.watchFrockfile && path === frockfilePath) {
      return reloadFile(path)
    }

    reload()
  })

  function reloadFile (path) {
    fs.readFile(path, function (err, raw) {
      if (err) {
        logger.error(
          'Failed to read config file on reload; reloading anyhow, but with ' +
            'previous config.'
        )

        return reload()
      }

      var config

      try {
        config = JSON.parse(raw)
      } catch (e) {
        logger.error(
          'Failed to parse configuration, error was: ' + e
        )

        return reload()
      }

      reload(config)
    })
  }

  function reload (config) {
    var args = [onConfig]

    if (config) {
      args.splice(0, 0, config)
    }
    frock.reload.apply(frock, args)

    function onConfig () {
      reloading = false
    }
  }
}
