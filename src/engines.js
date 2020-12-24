import walk from './package-walk'

export default function getEngines(pathInPkg) {
  const engines = {}

  const it = pkg => {
    if (Object.prototype.hasOwnProperty.call(engines, pkg.name)) return true
    engines[pkg.name] = {
      name: pkg.name,
      engines: pkg.engines,
      module: pkg.module,
      'jsnext:main': pkg['jsnext:main']
    }
  }

  try {
    walk(pathInPkg, it)
  } catch (err) {
    console.error(pathInPkg, err)
  }

  return engines
}
