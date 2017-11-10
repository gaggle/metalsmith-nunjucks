/* global describe, it */
const assert = require('assert')
const assertDir = require('assert-dir-equal')
const Metalsmith = require('metalsmith')
const path = require('path')

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

  it('handles render-error', function (done) {
    const fixture = expandFixture('render-error')
    buildMetalsmith(fixture.src, fixture.dst, [{}])
      .catch(err => { if (err) done() })
  })

  it('renders with per-file context', function () {
    const fixture = expandFixture('per-file-context')

    return buildMetalsmith(fixture.src, fixture.dst, [{}, customTags])
      .then(() => {
        return assertDir(fixture.dst, fixture.expected)
      })
  })
})

const assertRun = function (opts, callback) {
  const instance = nunjucks(opts)
  instance({}, {}, callback)
}

const buildMetalsmith = function (src, dst, nunjucksArgs) {
  const metalsmith = new Metalsmith('test/fixtures')
  return new Promise(function (resolve, reject) {
    metalsmith
      .source(src)
      .destination(dst)
      .use(nunjucks(...nunjucksArgs))
      .build(err => {
        if (err) return reject(err)
        resolve()
      })
  })
}

const customTags = function (nunjucks) {
  nunjucks.register('filename_tag', function () {
    return this.filename
  })
  nunjucks.register('file_keys_tag', function () {
    return Object.keys(this.file).sort()
  })
  nunjucks.register('files_keys_tag', function () {
    return Object.keys(this.files).sort()
  })
}

const expandFixture = function (fixture) {
  const dir = path.resolve(path.join('test', 'fixtures', fixture))

  let src = path.join(dir, 'source')
  let dst = path.join(dir, 'build')
  let expected = path.join(dir, 'expected')
  return {src, dst, expected}
}
