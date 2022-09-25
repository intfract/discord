function type(data) {
  if (typeof data === 'function') {
    return 0
  } else if (Array.isArray(data)) {
    return 1
  } else if (typeof data === 'object') {
    return 2
  } else if (typeof data === 'string') {
    return 3
  } else if (typeof data === 'number') {
    return 4
  }
}

// Array

export function choice(a: any[]) {
  return a[this.random(0, a.length)]
}

export function chunk(a: any[], n: number) : any[] {
  if (n) {
    n = Math.abs(n)
  } else {
    n = 1
  }
  const chunks = []
  for (let i = 0; i < a.length; i+= n) {
    chunks.push(a.slice(i, i + n))
  }
  return chunks
}

export function countif(a: any[], rule: string | string[]) : number {
  let count = 0
  if (type(rule) === 1) {
    for (const item of a) {
      let s = ''
      for (let i = 1; i < rule.length; i++) {
        if (i - 1) {
          s += `${rule[0]}(${JSON.stringify(item)}${rule[i]})`
        } else {
          s += `(${JSON.stringify(item)}${rule[i]})`
        }
      }
      if ((new Function(`return ${s}`)())) count++
    }
  } else {
    for (const item of a) {
      if ((new Function(`return ${JSON.stringify(item)}${rule}`)())) count++
    }
  }
  return count
}

export function distill(a: object[], rule: any) : object[] {
  if (type(rule) === 1) {
    return [a.filter(x => this.matchesProperty(rule[0], rule[1])(x)), a.filter(x => !this.matchesProperty(rule[0], rule[1])(x))]
  } else if (type(rule) === 2) {
    return [a.filter(x => this.matches(rule)(x)), a.filter(x => !this.matches(rule)(x))]
  } else if (type(rule) === 3) {
    return [a.filter(x => this.property(rule)(x)), a.filter(x => !this.property(rule)(x))]
  } else {
    return [a.filter(x => rule(x, a)), a.filter(x => !rule(x, a))]
  }
}

export function exclude(...arrays: any[][]) : any[] {
  let all = []
  for (const a of arrays) {
    all = all.concat(a)
  }
  const track = []
  const inter = []
  for (const item of all) {
    ((this.includes(track, item)) ? inter.push(item) : track.push(item))
  }
  return all.filter(x => !this.includes(inter, x))
}

export function filter(a: object[], rule: any) : object[] {
  if (type(rule) === 1) {
    return a.filter(x => this.matchesProperty(rule[0], rule[1])(x))
  } else if (type(rule) === 2) {
    return a.filter(x => this.matches(rule)(x))
  } else if (type(rule) === 3) {
    return a.filter(x => this.property(rule)(x))
  } else {
    return a.filter(x => rule(x, a))
  }
}

export function find(a: object[], rule: any) : object {
  if (type(rule) === 1) {
    for (let i = 0; i < a.length; i++) {
      if (this.matchesProperty(rule[0], rule[1])(a[i])) return a[i]
    }
  } else if (type(rule) === 2) {
    for (let i = 0; i < a.length; i++) {
      if (this.matches(rule)(a[i])) return a[i]
    }
  } else if (type(rule) === 3) {
    for (let i = 0; i < a.length; i++) {
      if (this.property(rule)(a[i])) return a[i]
    }
  } else {
    for (let i = 0; i < a.length; i++) {
      if (rule(a[i])) return a[i]
    }
  }
}

export function findIndexes(a: object[], rule: any) : number[] {
  let idx = []
  if (type(rule) === 1) {
    for (let i = 0; i < a.length; i++) {
      if (this.matchesProperty(rule[0], rule[1])(a[i])) idx.push(i)
    }
  } else if (type(rule) === 2) {
    for (let i = 0; i < a.length; i++) {
      if (this.matches(rule)(a[i])) idx.push(i)
    }
  } else if (type(rule) === 3) {
    for (let i = 0; i < a.length; i++) {
      if (this.property(rule)(a[i])) idx.push(i)
    }
  } else {
    for (let i = 0; i < a.length; i++) {
      if (rule(a[i])) idx.push(i)
    }
  }
  return idx
}

export function ifelse(a: any[], yes, no, fn: (item) => boolean) {
  const list = []
  for (let i = 0; i < a.length; i++) {
    if (fn(a[i])) {
      list.push(yes)
    } else {
      list.push(no)
    }
  }
  return list
}

export function includes(a: any[], item: any) : boolean {
  for (let i = 0; i < a.length; i++) {
    if (this.eq(a[i], item)) return true
  }
  return false
}

export function indexes(a: any[], item: any) : number[] {
  let idx =[]
  for (let i = 0; i < a.length; i++) {
    if (this.eq(a[i], item)) {
      idx.push(i)
    }
  }
  return idx
}

export function intersect(...arrays: any[][]) : any[] {
  let all = []
  for (const a of arrays) {
    all = all.concat(a)
  }
  return all.filter((x) => {
    for (const a of arrays) {
      if (!this.includes(a, x)) {
        return false
      }
    }
    return true
  })
}

export function insert(a: any[], index: number, item: number) : any[] {
  a.splice(index, 0, item)
  return a
}

export function iterate(arrays: any[][], fn: (items) => any) : any[] {
  const data = []
  for (let i = 0; i < arrays[0].length; i++) {
    const items = []
    for (const a of arrays) {
      items.push(a[i])
    }
    data.push(fn(items))
  }
  return data
}

export function last(a: any[]) {
  return a[a.length - 1]
}

export function matches(rule: object) {
  return (o: object) => {
    for (const [key, value] of Object.entries(rule)) {
      if (o[key] !== value && !this.eq(o[key], value)) return false
    }
    return true
  }
}

export function matchesProperty(key: string | number, value: any) {
  return (o: object) => {
    return this.eq(o[key], value)
  }
}

export function must(rule: object) {
  return (o: object) => {
    for (const [key, value] of Object.entries(rule)) {
      if (type(value) === 3) {
        if (!(new Function(`return ${JSON.stringify(o[key])}${value}`)())) return false
      } else if (type(value) === 1) {
        let s = ''
        for (let i = 1; i < value.length; i++) {
          if (i - 1) {
            s += `${value[0]}(${JSON.stringify(o[key])}${value[i]})`
          } else {
            s += `(${JSON.stringify(o[key])}${value[i]})`
          }
        }
        if (!(new Function(`return ${s}`)())) return false
      }
    }
    return true
  }
}

export function ndarray(n, d) : object {
  let o = {
    length: n,
    dimensions: d,
    data: [],
  }
  for (let i = 0; i < n ** d; i++) {
    o.data.push(this.ndpoint(i, n, d))
  }
  return o
}

export function ndindex(coords: number[], n: number) : number {
  let index = 0
  for (let i = 0; i < coords.length; i++) {
    index += coords[i] * n ** i
  }
  return index
}

export function ndpoint(index: number, n: number, d: number) : number[] {
  const coords = [index % n]
  const rem = []
  let r = index - index % n
  for (let i of this.range(d - 1, 0)) {
    if (n ** i <= r) {
      rem.unshift(Math.floor(r/n ** i))
      r = r % n ** i
    } else {
      rem.unshift(0)
    }
  }
  return coords.concat(rem)
}

export function nth(a: any[], n: number) {
  if (n < 0) {
    return a[a.length + n]
  } else {
    return a[n]
  }
}

export function property(key) {
  return (o: object) => {
    return o[key]
  }
}

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function range(start: number, end: number, step: number) : number[] {
  let a = []
  if (!step) step = 1
  if (start > end) {
    step *= -1
    for (let i = start; i > end; i += step) {
      a.push(i)
    }
  } else {
    for (let i = start; i < end; i += step) {
      a.push(i)
    }
  }
  return a
}

export function remove(a: any[], rule: (item) => any) : any[] {
  const list = []
  for (const item of a) {
    if (!rule(item)) {
      list.push(item)
    }
  }
  return list
}

export function search(a: any[], item: any, start: number, end: number) : number {
  if (!start) start = 0
  if (!end) end = a.length
  if (start > end) return undefined
  let mid = Math.floor((start + end) / 2)
  if (this.eq(a[mid], item)) return mid
  if (a[mid] > item) {
    return this.search(a, item, start, mid - 1)
  } else {
    return this.search(a, item, mid + 1, end)
  }
}

export function shuffle(a: any[], n: number) : any[] {
  if (!n || n < 1) n = 1
  for (let i of this.range(0, n)) {
    a.push(a.shift())
  }
  return a
}

export function subtract(target: any[], ...arrays: any[][]) : any[] {
  let sub = []
  for (const a of arrays) {
    sub = sub.concat(a)
  }
  return target.filter((x) => {
    return !this.includes(sub, x)
  })
}

export function times(n: number, fn: () => any) : any[] {
  let a = []
  for (let i = 0; i < n; i++) {
    a.push(fn())
  }
  return a
}

export function unique(a: any[]) : any[] {
  const c = []
  for (let i = 0; i < a.length; i++) {
    if (!this.includes(c, a[i])) c.push(a[i])
  }
  return c
}

export function unite(...arrays: any[][]) : any[] {
  let unision = []
  for (const a of arrays) {
    unision = unision.concat(a)
  }
  return unision
}

export function zip(...arrays: any[][]) : any[] {
  let zipped = []
  for (let i = 0; i < arrays[0].length; i++) {
    const items = []
    for (const a of arrays) {
      items.push(a[i])
    }
    zipped.push(items)
  }
  return zipped
}

// Logic

export function eq(...items: any[]) : boolean {
  for (let i = 0; i < items.length - 1; i++) {
    if (items[i] !== items[i + 1]) {
      if (type(items[i]) === type(items[i + 1])) {
        if (type(items[i]) === 1) {
          for (let j = 0; j < Math.max(items[i].length, items[i + 1].length); j++) {
            if (!this.eq(items[i][j], items[i + 1][j])) return false
          }
        } else if (type(items[i]) === 2) {
          if (Object.keys(items[i]).length === Object.keys(items[i + 1]).length) {
            for (const [key, value] of Object.entries(items[i])) {
              if (items[i + 1][key] !== value && !this.eq(items[i + 1][key], value)) return false
            }
          } else {
            return false
          }
        } else if (type(items[i]) === 3) {
          if (items[i].toLowerCase() !== items[i + 1].toLowerCase()) return false
        } else {
          return false
        }
      } else {
        return false
      }
    }
  }
  return true
}

// Numbers

export function factors(n: number) : number[] {
  if (Math.abs(n) === 1) return [1, n]
  const a = [1, n, -1, -n]
  for (let i of this.range(2,  Math.floor(Math.sqrt(Math.abs(n))) + 1)) {
    if (n % i === 0) {
      a.push(i, n/i, -i, -n/i)
    }
  }
  return a
}

export function perfectsq(n: number) : boolean {
  return this.nth(this.factors(n), -1) === this.nth(this.factors(n), -2)
}

export function prime(n: number) : boolean {
  return this.factors(n).length === 4
}

// Objects

export function fromPairs(a: any[][]) : object {
  let o = {}
  for (const item of a) {
    o[item[0]] = item[1]
  }
  return o
}

export function mapKeys(o: object, rule: (key: any, value: any) => any) : object {
  let thing = {}
  for (const [key, value] of Object.entries(o)) {
    thing[rule(key, o[key])] = o[key]
  }
  return thing
}

export function mapValues(o: object, rule: (value: any) => any) : object {
  let thing = {}
  for (const [key, value] of Object.entries(o)) {
    thing[key] = rule(o[key])
  }
  return thing
}

// Strings

export function compare(rule: string) {
  return (s: string) => {
    if (s.length !== rule.length) return false
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== rule[i] && rule[i] !== '?') return false
    }
    return true
  }
}
