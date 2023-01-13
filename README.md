# Discord

A Modern Discord Utility Bot!

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
> Check the interactionCreate.js event and the fract.js file to make sure the eval is still safe!

## Security

The `data.fjs` file prevents malicious users from **hacking** the bot and stealing **token** information from the `process.env` object. Malicious code can not access `eval` to get past security implementations. 

The bot token can also be found in the `client.token` property. 

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