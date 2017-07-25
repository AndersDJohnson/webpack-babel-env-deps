import path from 'path'


export default function requirePackage (pkgRoot) {
  const pkgPath = path.join(pkgRoot, 'package.json')

  return typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__(pkgPath) : require(pkgPath)
}
