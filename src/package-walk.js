import resolve from 'resolve'
import _ from 'lodash'
import findRoot from 'find-root'

import requirePackage from './require-package'


function walkDeps (deps, it, root) {
  _.each(deps, (__, name) => {
    let depPath
    try {
      depPath = resolve.sync(name, {
        basedir: root,
        packageFilter: pkg => ({ ...pkg, main: pkg.main || 'package.json' })
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
    pkgRoot = findRoot(pathInPkg)
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
