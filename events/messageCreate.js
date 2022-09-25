const _ = require('defract')
const fs = require('fs')
const client = require('..')

module.exports = {
  respond(message) {
    if (message.content.startsWith(client.prefix)) {
      const args = message.content.substring(client.prefix.length).split(',')
      const command = args.shift().trim()
      if (!_.last(args)) {
        args.pop()
      }
      for (let i = 0; i < args.length; i++) {
        args[i] = args[i].trim()
      }
      
    }
  }
}