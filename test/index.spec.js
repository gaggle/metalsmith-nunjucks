/* global describe, it */
const assert = require('assert')
const nunjucks = require('../lib/index')

describe('metalsmith-nunjucks', function () {
  it('initialises with no arguments', function () {
    nunjucks()
  })

  it('initialises with empty options', function () {
    nunjucks({})
  })

  it('initialises with undefined extensions', function () {
    nunjucks({}, undefined)
  })

  it('calls extensions on initialisation', function (done) {
    nunjucks({}, () => done())
  })

  it('fails to run if pattern is an array', function (done) {
    assertRun({pattern: 'foo'}, function (err) {
      assert.equal(err, undefined)
      done()
    })
  })

  it('fails to run if pattern is an array', function (done) {
    assertRun({pattern: ['foo']}, function (err) {
      assert(err instanceof Error)
      done()
    })
  })

})

const assertRun = function (opts, callback) {
  const instance = nunjucks(opts)
  instance({}, {}, callback)
}
