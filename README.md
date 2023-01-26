# Discord

This is a powerful discord bot that can interact with ChatGPT, fetch data from Google, and execute JavaScript code safely!

## Events 

This bot has an effective event handler. The basic events are listed below. 
- debug
- error
- interactionCreate
- messageCreate
- ready

## Slash Commands 

This bot mainly operates on slash commands. Currently, there are 3 categories with commands:
- ai
  - chatgpt
- bot 
  - help
  - ping
- fun
  - trivia
- utility
  - avatar
  - embed
  - profile
  - reactroles
  - reactembed

This bot stores reaction roles information by writing to a `reactions.discord` file which contains information about the `message.id`, roles, and emojis. It is also capable of executing scripts delivered by discord users. 

## Linear Commands

This bot can execute `script` commands that communicate directly with the Discord framework.
> Check the interactionCreate.js event for any vulnerabilities!

## Security

It is important to note that `new Function()` constructors should always be used instead of `eval()`. **Never pass discord interfaces directly** into the function constructor. Make sure to read the [Discord.js Documentation](https://discord.js.org/#/docs/discord.js/main/class/Client) when adding features to the *script* command in the `interactionCreate.js` file.

### Avoid ✕

The `Client`, `Guild`, and `RoleManager` classes can be abused easily. 

```js
(new Function('interaction', `interaciton.reply({ content: interaction.guild.client.token })`))(interaction)
// exposes MessageInteraction, Guild, and Client.token
```

### Do ✓

The user is limited to the context which only contains a reply function.

```js
(new Function('ctx', `ctx.reply({ content: 'Hello, World!' })`))({ reply(message) { interaction.reply(message) } })
// only replies to MessageInteraction
```

Nullifying the `process` object prevents hackers from touching your **token**!

```js
(new Function('process', `return process.env.token`))(null)
// cannot read property 'env' of null
```

During **debugging** the client will log the bot's **token** unless you prevent it by using a conditional or by removing the `console.log` from the `events/debug.js` file completely. 

## Open AI

Open AI functions are stored in the `openai` folder which contains a `chatgpt.js` file. Most interactions with Open AI are asynchronous and can take over 3 seconds to complete. This means that `Collector` objects are required for longer completions. The `openai` package is available on [NPM](https://npmjs.org/package/openai).

```js
const { Configuration, OpenAIApi} = require('openai')
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.openai // get your key from the website
})

const openai = new OpenAIApi(configuration)
```

### Completions Endpoint

Make sure to set the `max_tokens` property to increase the size of the response. Larger responses take more time. 

```js
async function say(instruction) {
  try {
    return await openai.createCompletion({
      model: "text-davinci-003",
      prompt: instruction,
      temperature: 0,
      max_tokens: 1024, // answer length is around 3 * max_tokens characters
    })
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
    }
  }
}
```

The `say` function can be exported and used in a slash command. Collectors are important because they can last up to **15 minutes** without a response. 

```js
const user = interaction.user
const prompt = interaction.options.get('prompt').value
const seconds = 5

const embed = new EmbedBuilder()
  .setTitle('ChatGPT')
  .setDescription(prompt)
  .setThumbnail('https://brandlogovector.com/wp-content/uploads/2023/01/ChatGPT-Icon-Logo-PNG.png')
  .setColor('#12a37f')

return interaction.reply({ content: `Generating your response in ${seconds} seconds!`, embeds: [embed] }).then(m => {
  const collector = m.createMessageComponentCollector({ time: seconds * 1000 })

  chatgpt.say(prompt).then(completion => {
    console.log(completion.data.choices)
    return interaction.editReply({ content: completion.data.choices[0].text })
  })

  collector.on('end', (collected, reason) => {
    if (reason === 'time') {
      console.log('timeout')
    }
  })
})
```

## Hosting 

Hosting can be a problem because discord **ratelimits** replit. After 24 hours your repl is bound to go offline despite [Uptime Robot](https://uptimerobot.com) pinging the address of your repl. Other reliable options are usually paid but [Int Fract](https://github.com/intfract) has found free alternatives. 

### Render 

[Render](https://render.com) is free and mostly free of hassle. There are some things to remember about environment variables and node versions. 

1. Create an account and log in with GitHub!
2. Click `New`!
  - Select `Web Service` which is recommended for your discord bot!
  - Select `Static Site` for a discord bot dashboard!
3. Connect to GitHub and select a repository!
4. Open the advanced options dropdown and add [environment variables](https://render.com/docs/environment-variables)!
5. Configure your deployment!
  - Your build command which is usually `npm install` or `npm run build` is run once before the app goes online!
  - Your run command which is usually `node .` or `npm run dev` is used to start the app!

If you encounter an **ERROR** after the run command, read the error message carefully and troubleshoot. 
- The missing `node:events` module error suggests that the current version of node is too old!
  - [Specify a node version](https://render.com/docs/node-version) by adding a `.node-version` file and typing `19.5.0`
- The `InvalidTokenError` error suggests a few things. 
  - You have provided the wrong token! 
  - You have made a mistake in the `.env` file by using quotes! 
  - You have not configured [environment variables](https://render.com/docs/configure-environment-variables) on your render web service! 

The discord bot will go offline after a few minutes of inactivity unless it is equipped with an `http` or `express` server that can use the `PORT` environment variable. 

```js
const port = process.env.PORT || 3000 // uses render.com PORT if available or defaults to 3000
require('http').createServer((req, res) => res.end(process.version)).listen(port)
```

### Fly

[Fly.io](https://fly.io) offers limited features for free if you have a credit card. Fly only asks for a credit card to verify deployments. This can be solved by searching google for random credit cards with expiry dates. Honestly, it takes a bit of effort.

The `ba.sh` file contains some scripts for a fly deployment although the docs explain the process clearly. Most online development platforms like Gitpod and Replit use linux. The commands may vary between linux, windows, and mac. The following code is for *Visual Studio Code Browser* Gitpod users.

```sh
curl -L https://fly.io/install.sh | sh
# Wait for the previous command to finish and check for additional messages
export FLYCTL_INSTALL="/home/gitpod/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
```

Deploying the bot with `fly launch` will create files called `fly.toml` and `.dockerignore` that have already been included in this repository. Make sure to remove the `fly.toml` and add a new one. 
> Environment variables are ignored by git and change between environments! 

The bot can be launched with environment variables. 

```sh
flyctl secrets set token=YOUR_BOT_TOKEN client=YOUR_CLIENT_ID
```

## Debugging 

### Replit Bot Login 

This message always appears. 

```
(node:281) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

If the bot fails to log on then kill the container in the **shell**. 

```sh
kill 1
```

### Embed Builder Errors 

Try and catch blocks need to be used to prevent the bot from crashing due to faulty user input. This happens when users use poor formatting on their embed options. Invalid URLs and hex codes will trigger these erros as well. 

```js
try {
  embed[`set${x}`](v)
} catch (e) {
  console.log(e)
}
```

Wrapping functions also works. Once the erros are caught the embed will work fine but without the parts that generated the errors. 

```js
function safe(fn) {
  try {
    fn()
  } catch (e) {
    console.log(e)
  }
}

safe(() => embed[`set${x}`](v))
```

### Visual Studio Code FJS Files

The `.fjs` file can be configured using **file associations** in the settings page of Visual Studio Code.

Pasting the code below into `settings.json` also works!

```json
{
  "files.associations": {
    "*.fjs": "javascript"
  }
}
```