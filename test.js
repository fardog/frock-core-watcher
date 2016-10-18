var EE = require('events').EventEmitter

var test = require('tape')
var proxyquire = require('proxyquire')

var chokidarMock = {}

var lib = proxyquire(
  './',
  {
    'chokidar': chokidarMock,
    '@noCallThru': true
  }
)

test('calls watch with expected options', function (t) {
  t.plan(4)

  var expectedWatch = './frockfile.json'
  var expectedOpts = {usePolling: true}
  var chokidar = new EE()

  chokidarMock.watch = function watch (watch, opts) {
    t.deepEqual(watch, [expectedWatch])
    t.deepEqual(opts, expectedOpts)

    return chokidar
  }

  var frock = {
    reload: function (cb) {
      t.pass('called reload')
      process.nextTick(cb)
    }
  }
  var logger = {
    info: function (msg) {
      t.ok(msg.indexOf(expectedWatch) !== -1)
    }
  }

  lib(frock, logger, {
    watch: expectedWatch,
    options: expectedOpts
  })

  chokidar.emit('all', expectedWatch)
})
