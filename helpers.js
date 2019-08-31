import _uniq from 'lodash.uniq'

export const buildSet = trainingSet => trainingSet.map(x => `${x.title} ${x.body} ${x.user.login}`)

export const parseStr = (str) => str.split(' ')
  .map(
    x => x.replace(',', '')
      .toLowerCase()
      .replace(/\r?\n|\r/g, '')
      .replace(/[^a-z0-9]/, '')
      .trim()
  )

export const parse = (raw) => (
  raw.reduce((acc, x) => {
    const arr = parseStr(x)

    return _uniq([...acc, ...arr])
  }, [])
)

export const buildKey = (raw) => (
  parse(raw)
    .reduce((acc, x, i) => {
      acc[x] = i
      return acc
    }, {})
)

export const normalizeItem = (item, key) => {
  const arr = new Array(Object.keys(key).length)
    .fill(0)

  const parsedItem = parseStr(item)
  parsedItem.forEach((x) => {
    if (typeof key[x] === 'number') {
      arr[key[x]] = 1
    }
  })

  return arr
}

export const buildXs = (raw, key) => raw.map(x => (
  normalizeItem(x, key)
))

export const buildYs = answers => answers.map(x => [x])
