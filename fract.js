function fract(code, a) {
  const fragments = code.match(/\$([.][A-z]+([.][A-z]+)*)/g)
  for (const fragment of fragments) {
    const chain = fragment.slice(1)
    code = code.replace(fragment, eval(`a${chain}`))
  }
  return code
}

module.exports = fract