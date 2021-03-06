exports = module.exports = require('./lib')

// if this is being run directly, then attempt to load it as
// server instead of module
/* istanbul ignore if  */
if (module.id === '.') {
  var fs = require('fs')
  var path = require('path')
  var appjs = path.join(__dirname, 'app.js')
  if (fs.existsSync(appjs)) {
    try {
      require(appjs)
    } catch (E) {
      console.error(E)
    }
  }
}
