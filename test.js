var EE = require('events').EventEmitter

var test = require('tape')
var proxyquire = require('proxyquire')

var chokidarMock = {}
var fsMock = {}

var lib = proxyquire(
  './',
  {
    'chokidar': chokidarMock,
    'fs': fsMock,
    '@noCallThru': true
  }
)

test('calls watch with expected options', function (t) {
  t.plan(4)

  var expectedWatch = './frockfile.json'
  var expectedOpts = {usePolling: true, ignoreInitial: true}
  var chokidar = new EE()

  chokidarMock.watch = function watch (watch, opts) {
    t.deepEqual(watch, [expectedWatch])
    t.deepEqual(opts, expectedOpts)

    return chokidar
  }

  var frock = {
    argv: {file: 'wut'},
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
    chokidarOptions: expectedOpts
  })

  chokidar.emit('all', 'add', expectedWatch)
})

test('reloads config when requested', function (t) {
  t.plan(3)

  var expectedWatch = './frockfile.json'
  var expectedConfig = {cool: 'yep'}
  var chokidar = new EE()

  chokidarMock.watch = function watch (watch) {
    t.deepEqual(watch, [expectedWatch])

    return chokidar
  }

  fsMock.readFile = function (file, cb) {
    t.equal(file, expectedWatch)

    process.nextTick(function () {
      cb(null, JSON.stringify(expectedConfig))
    })
  }

  var frock = {
    argv: {file: expectedWatch},
    reload: function (config, cb) {
      t.deepEqual(config, expectedConfig)
      process.nextTick(cb)
    }
  }
  var logger = {info: function () {}}

  lib(frock, logger, {watchFrockfile: true})

  chokidar.emit('all', 'add', expectedWatch)
})
