/* global describe, it */
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
})
