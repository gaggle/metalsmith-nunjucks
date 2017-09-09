'use strict'
const match = require('multimatch')
const NunjucksTag = require('nunjucks-tags')
const utf8 = require('is-utf8')

const plugin = function (options = {}, ...extensions) {
  const config = options.config || {}
  const pattern = options.pattern || '**'
  const nunjucks = new NunjucksTag()

  extensions.forEach(fn => {
    if (fn === undefined) return
    fn(nunjucks, config)
  })

  return (files, metalsmith, done) => {
    if (typeof pattern !== 'string') {
      done(new Error('invalid pattern, the pattern option should be a string.'))
    }

    // Map all files that should be processed to an array of promises
    const promises = Object.keys(files)
      .filter(filename => match(filename, pattern)[0])
      .filter(filename => utf8(files[filename].contents))
      .map(filename => new Promise((resolve, reject) => {
        try {
          let data = files[filename]
          resolve(nunjucks.render(data.contents.toString())
            .then(result => {
              data.contents = Buffer.from(result, 'utf8')
            })
          )
        } catch (err) {
          reject(err)
        }
      }))

    // Call done callback when all promises are resolved
    Promise
      .all(promises)
      .then(() => done())
      .catch((err) => done(err))
  }
}

module.exports = plugin
