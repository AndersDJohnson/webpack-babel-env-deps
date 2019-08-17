// eslint-disable-next-line camelcase, no-undef
export default path =>
  typeof __non_webpack_require__ !== 'undefined'
    ? __non_webpack_require__(path)
    : require(path)
