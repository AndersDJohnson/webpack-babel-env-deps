import _ from 'lodash'

const sepRex = '(/|\\\\)'

export function group(names) {
  return `(${names.join('|')})`
}

export function excludeAsString(names, { except }) {
  if (except) {
    if (typeof except === 'string') names = names.slice().concat(except)
    else names = names.slice().concat(except)
  }
  return names.length === 0
    ? `node_modules/.*`
    : `node_modules(?!${sepRex}${group(names)}${sepRex})`
}

export function includeAsString(names, { except }) {
  const filterFn = name => {
    if (typeof except === 'function') return !except(name)
    if (typeof except === 'string') return except !== name
    return !_.includes(except, name)
  }
  return `node_modules${sepRex}${group(names.filter(filterFn))}${sepRex}.*`
}

export function includeAsRegExp(names, options) {
  return new RegExp(includeAsString(names, options))
}

export function excludeAsRegExp(names, options) {
  return new RegExp(excludeAsString(names, options))
}

export function include(names = [], options = {}) {
  return includeAsRegExp(names, options)
}

export function exclude(names = [], options = {}) {
  return excludeAsRegExp(names, options)
}

export default exclude
