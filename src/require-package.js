import path from 'path'
import nonWebpackRequire from './non-webpack-require'

export default function requirePackage (pkgRoot) {
  const pkgPath = path.join(pkgRoot, 'package.json')

  return nonWebpackRequire(pkgPath)
}
