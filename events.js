const fs = require('fs');

module.exports = (client) => {
  const files = fs.readdirSync('./events/').filter((file) => file.endsWith('.js'))
  for (const file of files) {
    const event = require(`./events/${file}`)
    client.on(file.substring(0, file.length - 3), (...args) => event.respond(...args))
  }
};