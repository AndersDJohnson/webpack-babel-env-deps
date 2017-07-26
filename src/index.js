import _ from 'lodash'
import semver from 'semver'
import plugins from 'babel-preset-env/data/plugins.json'
import getEngines from './engines'
import {
  exclude as excludeRegex,
  include as includeRegex
} from './node-modules-regex'
import normalizeSemver from './semver-normalize'

export function getModuleNeedsBabel (values, name, { hasModuleInMainFields } = {}) {
  const { engines, module } = values
  // always transpile if we have a module
  if (hasModuleInMainFields && module) {
    return true
  }
  if (!engines) return false
  const range = engines.node
  if (!range) return false
  if (range === '*') return false
  return _.some(plugins, ({ node }) => !semver.satisfies(normalizeSemver(node), range))
}

export function getHasModuleInMainFields (options = {}) {
  const { mainFields } = options
  return !mainFields || (
    mainFields.indexOf('module') >= 0 && (
      mainFields.indexOf('main') === -1 || mainFields.indexOf('module') < mainFields.indexOf('main')
    )
  )
}

function getNeedBabel (pathInPkg = process.cwd(), options = {}) {
  const hasModuleInMainFields = getHasModuleInMainFields(options)
  const modules = getEngines(pathInPkg, options)

  const needBabel = _(modules)
    .map((values, name) => ({
      name,
      ...values,
      needsBabel: !!getModuleNeedsBabel(values, name, { ...options, hasModuleInMainFields })
    }))
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
