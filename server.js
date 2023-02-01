const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fs = require('fs')
const fetch = require('node-fetch')
const client = require('.')

const url = (port === 3000) ? `https://discord.com/api/oauth2/authorize?client_id=${process.env.client}&redirect_uri=https%3A%2F%2F3000-intfract-discord-0yhi9voe9w0.ws-us84.gitpod.io&response_type=code&scope=identify%20guilds%20guilds.join%20guilds.members.read` : `https://discord.com/api/oauth2/authorize?client_id=${process.env.client}&redirect_uri=https%3A%2F%2Ffract-m3ac.onrender.com%2F&response_type=code&scope=identify%20guilds%20guilds.join%20guilds.members.read`

app.use(express.static('public'))

function type(data) {
  return Object.prototype.toString.call(data).slice(8, -1)
}

function isObject(data) {
  return type(data) === 'Object' && Object.getPrototypeOf(data).constructor === Object && Object.getPrototypeOf(data) === Object.prototype
}

function execute(code, locals) {
  let s = ''
  for (const [k, v] of Object.entries(locals)) {
    if (type(v) === 'Array') {
      s += `const ${k} = [${v.join(', ')}];\n`
      continue
    }
    if (type(v) === 'String') {
      s += `let ${k} = "${v}";\n`
      continue
    }
    if (type(v) === 'Number') {
      s += `let ${k} = ${v};\n`
      continue
    }
    if (isObject(v)) {
      s += `let ${k} = ${JSON.stringify(v)};\n`
      continue
    }
  }
  let output = ''
  try {
    const forge = new Function('process', 'eval', 'Function', 'Object', 'include', 'client', `${s} return ${code.match(/(?<=#{)(.|\n)+?(?=})/g)};`)
    output = forge(null, null, null, Object, (file) => fs.readFileSync(`views/${file}`, 'utf-8'), client)
  } catch (e) {
    console.log(e)
  }
  return output
}

function render(file, locals) {
  let html = fs.readFileSync(file, 'utf-8')
  const matches = html.matchAll(/#{(.|\n)+?}/g)
  for (const match of matches) {
    console.log(match[0])
    html = html.replace(match[0], execute(match[0], locals))
  }
  return html
}

function route(req, res, locals) {
  res.send(render(`views${req.originalUrl.split('?')[0] + '/index.html'}`, locals))
}

app.get('/', async (req, res) => {
  const { code } = req.query
  console.log(code)
  if (code) {
    try {
      const params = new URLSearchParams({
        client_id: process.env.client,
        client_secret: process.env.secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `https://3000-intfract-discord-0yhi9voe9w0.ws-us84.gitpod.io/`,
        scope: 'identify guilds guilds.join guilds.members.read',
      })
      console.log(params)
			const tokenResponseData = await fetch('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: params,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})

			const oauthData = await tokenResponseData.json()
			console.log(oauthData)

      if (oauthData.error === 'invalid_grant') {
        console.log(`OAUTH ERROR: ${oauthData.error}`)
        route(req, res, { title: 'Discord', message: 'Hello, World!', auth: url })
      } else {
        const access = oauthData.access
        const refresh = oauthData.refresh
        const userResult = await fetch('https://discord.com/api/users/@me', {
          headers: {
            authorization: `${oauthData.token_type} ${access}`,
          },
        })
        const user = await userResult.json()
        console.log(user)
        route(req, res, { title: 'Discord', message: 'Hello, World!', auth: url, user })
      }
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error
			// tokenResponseData.statusCode will be 401
			console.log(error)
      route(req, res, { title: 'Discord', message: 'Hello, World!', auth: url })
		}
  } else {
    route(req, res, { title: 'Discord', message: 'Hello, World!', auth: url })
  }
})

app.get('/status', (req, res) => {
  route(req, res, { title: client.user.tag, version: process.version })
})

app.listen(port, () => {
  console.log(`Server is online at port ${port}!`)
})