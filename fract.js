function fract(code, a) {
  const fragments = code.match(/\$([.][A-z]+([.][A-z]+)*)/g)
  for (const fragment of fragments) {
    const trail = fragment.split('.').splice(1)
    code = code.replace(fragment, `${(trail[1]) ? a[trail[0]][trail[1]] : a[trail[0]]}`)
  }
  return code
}

module.exports = fract