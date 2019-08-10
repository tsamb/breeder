let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

  debugger;
  var hash = crypto.createHash('sha256')
  hash.write("x")
  var digest = hash.digest("hex")

  console.log(digest)