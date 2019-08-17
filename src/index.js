import _ from 'lodash'
import semver from 'semver'
import debug from 'debug'
import readPkgUp from 'read-pkg-up'
import plugins from 'babel-preset-env/data/plugins.json'
import semverMinForRange from './semver-min-for-range'
import getDependencies from './get-dependencies'
import {
  exclude as excludeRegex,
  include as includeRegex
} from './node-modules-regex'
import normalizeSemver from './semver-normalize'

export function getPluginsThatDontSatisfyModuleRange(plugins, range) {
  return _.pickBy(
    plugins,
    ({ node }) => !semver.satisfies(normalizeSemver(node), range)
  )
}

export function getModuleNeedsBabel(
  pkg,
  { hasEsNextInMainFields, hostEngines, defaultEngines } = {}
) {
  let { engines } = pkg
  const hasEsNextField = getHasESNextField(Object.keys(pkg))
  // always transpile if we have an esnext field
  if (hasEsNextInMainFields && hasEsNextField) {
    return true
  }
  if (!engines) {
    if (defaultEngines) {
      if (typeof defaultEngines !== 'object') {
        return true
      }
      engines = defaultEngines
    } else {
      return false
    }
  }
  const range = engines.node
  if (!range) return false
  if (range === '*') return false

  if (hostEngines && hostEngines.node) {
    const minVersionForEngines = semverMinForRange(range)
    const minVersionForHostEngines = semverMinForRange(hostEngines.node)

    return semver.gt(minVersionForEngines, minVersionForHostEngines)
  }

  const pluginsThatDontSatisfyModuleRange = getPluginsThatDontSatisfyModuleRange(
    plugins,
    range
  )
  const namesOfPluginsThatDontSatisfyRange = _.map(
    pluginsThatDontSatisfyModuleRange,
    (plugin, name) => ({ name, node: plugin.node })
  )
  const somePluginsDontSatisfyModuleRange = !_.isEmpty(
    pluginsThatDontSatisfyModuleRange
  )
  if (somePluginsDontSatisfyModuleRange && debug.enabled) {
    debug('plugins')(
      `name "${pkg.name} range "${range}" doesn't satisfy plugins ` +
        `${namesOfPluginsThatDontSatisfyRange.map(p => `${p.name} ${p.node}`)}`
    )
  }
  return somePluginsDontSatisfyModuleRange
}

/**
 * `module` in webpack 3, maybe also `jsnext:main` in webpack 2
 */
export const esNextFields = ['module', 'jsnext:main']

export const isESNextField = field => _.includes(esNextFields, field)

export function getHasESNextField(mainFields = []) {
  return mainFields.some(mainField => _.includes(esNextFields, mainField))
}

export function getIndexOfESNextField(mainFields = []) {
  return mainFields.findIndex(isESNextField)
}

export function isESNextFieldBeforeMainField(mainFields = []) {
  return (
    mainFields.length >= 0 &&
    (!_.includes(mainFields, 'main') ||
      (getHasESNextField(mainFields) &&
        getIndexOfESNextField(mainFields) < mainFields.indexOf('main')))
  )
}

export function getHasESNextInMainFields(options = {}) {
  const { mainFields } = options
  const usesDefaultMainFields = !mainFields
  return usesDefaultMainFields || isESNextFieldBeforeMainField(mainFields)
}

export function getNeedBabel(options) {
  const pathInPkg = options.path || process.cwd()
  const pkg = readPkgUp.sync({
    cwd: pathInPkg
  })

  const dependencies = getDependencies(pathInPkg, options)

  return getNeedBabelFromPackageAndDependencies(pkg, dependencies, options)
}

export function getNeedBabelFromPackageAndDependencies(
  pkg,
  dependencies,
  options
) {
  const hostEngines =
    options.engines === false
      ? null
      : (typeof options.engines === 'object' && options.engines) || pkg.engines

  const hasEsNextInMainFields = getHasESNextInMainFields(options)

  const needBabel = _(dependencies)
    .map(pkg => ({
      ...pkg,
      needsBabel: !!getModuleNeedsBabel(pkg, {
        ...options,
        hasEsNextInMainFields,
        hostEngines
      })
    }))
    .compact()
    .filter(({ needsBabel }) => needsBabel)
    .value()

  // console.log(`Of ${_.size(modules)} modules, ${_.size(needBabel)} need babel`)

  return needBabel.map(mod => mod.name).sort()
}

export function exclude(options = {}) {
  const names = getNeedBabel(options)

  return excludeRegex(names, options)
}

export function include(options = {}) {
  const names = getNeedBabel(options)

  return includeRegex(names, options)
}

export default {
  exclude
}
