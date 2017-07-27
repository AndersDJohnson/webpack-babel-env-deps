export function group (names) {
  return `(${names.join('|')})`
}

export function excludeAsString (names) {
  return names.length === 0 ? `node_modules/.*` : `node_modules/(?!(/|\\\\)${group(names)}(/|\\\\))`
}

export function includeAsString (names) {
  return `node_modules/${group(names)}/.*`
}

export function includeAsRegExp (names) {
  return new RegExp(includeAsString(names))
}

export function excludeAsRegExp (names) {
  return new RegExp(excludeAsString(names))
}

export function include (names = []) {
  return includeAsRegExp(names)
}

export function exclude (names = []) {
  return excludeAsRegExp(names)
}

export default exclude
