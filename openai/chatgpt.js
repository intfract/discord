const { Configuration, OpenAIApi} = require('openai')
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.openai
})

const openai = new OpenAIApi(configuration)

module.exports = {
  async say(instruction) {
    try {
      return await openai.createCompletion({
        model: "text-davinci-003",
        prompt: instruction,
        temperature: 0,
        max_tokens: 1024,
      })
    } catch(error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data)
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`)
      }
    }
  },
}