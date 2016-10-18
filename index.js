var arrify = require('arrify')
var chokidar = require('chokidar')

module.exports = createWatcherCore

function createWatcherCore (frock, logger, _opts) {
  var opts = _opts || {}
  var watch = arrify(opts.watch || [])
  var chokidarOptions = opts.options || {}

  var reloading = false

  chokidar.watch(watch, chokidarOptions).on('all', function (path) {
    if (reloading) return

    reloading = true

    logger.info('reloading on path change: ' + path)
    frock.reload(function () {
      reloading = false
    })
  })
}
