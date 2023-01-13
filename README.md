# Discord

A Modern Discord Utility Bot with **SAFE** Script Execution!

## Events 

This bot has an effective event handler. For now, it watches: 
- interactionCreate
- messageCreate
- ready

## Slash Commands 

This bot mainly operates on slash commands. Currently, there are 3 categories with commands: 
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

It is important to note that `new Function()` constructors should always be used instead of `eval()`. **Never pass discord interfaces directly** into the function constructor. 

### Avoid ✕

```js
console.log((new Function('interaction', `interaciton.reply({ content: interaction.guild.client.token })`))(interaction)) // exposes MessageInteraction, Guild, and Client
```

### Do ✓

```js
console.log((new Function('ctx', `ctx.reply({ content: 'Hello, World!' })`))({ reply(message) { interaction.reply(message) } })) // replies to a MessageInteraction
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