import _ from 'lodash'
import semver from 'semver'
import plugins from 'babel-preset-env/data/plugins.json'
import getEngines from './engines'
import {
  exclude as excludeRegex,
  include as includeRegex
} from './node-modules-regex'
import normalizeSemver from './semver-normalize'


function getNeedBabel (pathInPkg = process.cwd(), options) {
  const modules = getEngines(pathInPkg, options)

  const needBabel = _(modules)
    .map((engines, name) => {
      if (!engines) return
      const range = engines.node
      if (!range) return
      if (range === '*') return
      const needsBabel = _.some(plugins, ({ node }) => !semver.satisfies(normalizeSemver(node), range))
      return {
        name,
        engines,
        needsBabel
      }
    })
    .compact()
    .filter(({ needsBabel }) => needsBabel)
    .value()

  // console.log(`Of ${_.size(modules)} modules, ${_.size(needBabel)} need babel`)

  return needBabel.map(mod => mod.name).sort()
}

export function exclude (pathInPkg, options) {
  const names = getNeedBabel(pathInPkg, options)

  return excludeRegex(names)
}

export function include (pathInPkg, options) {
  const names = getNeedBabel(pathInPkg, options)

  return includeRegex(names)
}

export default {
  exclude
}
