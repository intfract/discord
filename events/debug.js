const client = require('..')
var spawn = require('child_process').spawn
// var child = spawn('node .')

// child.stdout.setEncoding('utf8');
// child.stdout.on('data', function(data) {
//   console.log('stdout: ' + data)
//   data=data.toString()
// })

let heartbeats = 0

module.exports = {
  respond(message) {
    if (message.startsWith('[WS => Shard 0]')) console.log(heartbeats++)
  }
}