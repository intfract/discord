const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fs = require('fs')

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
  const forge = new Function('process', 'eval', 'Function', 'Object', `${s} return ${code.match(/(?<=\${)(.|\n)[^$]+(?=})/g)};`)
  const output = forge(process, null, null, Object)
  console.log(output)
  return output
}

function render(file, locals) {
  let html = fs.readFileSync(file, 'utf-8')
  const matches = html.matchAll(/\${(.|\n)[^$]+}/g)
  for (const match of matches) {
    console.log(match[0])
    html = html.replace(match[0], execute(match[0], locals))
  }
  console.log(html)
  return html
}

function route(req, res, locals) {
  res.send(render(`views/${req.baseUrl + 'index.html'}`, locals))
}

app.get('/', (req, res) => {
  route(req, res, { title: 'Discord', message: 'Hello, World!' })
})

app.listen(port, () => {
  console.log(`Server is online at port ${port}!`)
})