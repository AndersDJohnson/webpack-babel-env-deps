import resolve from 'resolve-pkg'
import _ from 'lodash'
import pkgDir from 'pkg-dir'

import requirePackage from './require-package'

function walkDeps (deps, it, root) {
  _.forEach(deps, (__, name) => {
    let depPath
    try {
      depPath = resolve(name, {
        cwd: root
      })
    } catch (err) {
      // maybe `name` module doesn't have a `main` field in its `package.json`
      console.error(name, err)
      return
    }

    walk(depPath, it, false)
  })
}

export default function walk (pathInPkg, it, isRoot = true) {
  let pkgRoot
  try {
    pkgRoot = pkgDir.sync(pathInPkg)
  } catch (err) {
    console.error(pathInPkg, err)
    return
  }

  const pkg = requirePackage(pkgRoot)

  if (it(pkg)) return

  walkDeps(pkg.dependencies, it, pkgRoot)

  if (isRoot) {
    walkDeps(pkg.devDependencies, it, pkgRoot)
  }
}
