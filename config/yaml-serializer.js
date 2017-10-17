const { safeDump } = require('js-yaml');

module.exports = {
  print: val => safeDump(val),
  test: val => val === val,
};
