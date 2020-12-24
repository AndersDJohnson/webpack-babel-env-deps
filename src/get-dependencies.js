import walk from './package-walk'

// TODO: Implement depth option.
export default function getDependencies(pathInPkg) {
  const dependencies = {}

  const it = pkg => {
    if (Object.prototype.hasOwnProperty.call(dependencies, pkg.name))
      return true
    dependencies[pkg.name] = pkg
  }

  try {
    walk(pathInPkg, it)
  } catch (err) {
    console.error(pathInPkg, err)
  }

  return dependencies
}
