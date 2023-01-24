const client = require('..')

let heartbeats = 0

module.exports = {
  respond(message) {
    if (message.startsWith('[WS => Shard 0]')) console.log(heartbeats++, message)
  }
}