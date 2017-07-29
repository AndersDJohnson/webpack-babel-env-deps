import walk from './package-walk'

// TODO: Implement depth option.
export default function getDependencies (pathInPkg, { depth = 1 } = {}) {
  const dependencies = {}

  const it = pkg => {
    if (dependencies.hasOwnProperty(pkg.name)) return true
    dependencies[pkg.name] = pkg
  }

  try {
    walk(pathInPkg, it)
  } catch (err) {
    console.error(pathInPkg, err)
  }

  return dependencies
}
