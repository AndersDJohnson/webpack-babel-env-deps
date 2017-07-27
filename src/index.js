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

/**
 * `module` in webpack 3, maybe also `jsnext:main` in webpack 2
 */
export const esNextFields = ['module', 'jsnext:main']

export const isESNextField = field => _.includes(esNextFields, field)

export function getHasESNextField (mainFields = []) {
  return mainFields.some(mainField => _.includes(esNextFields, mainField))
}

export function getIndexOfESNextField (mainFields = []) {
  return mainFields.findIndex(isESNextField)
}

export function isESNextFieldBeforeMainField (mainFields = []) {
  return mainFields.length >= 0 && (
    !_.includes(mainFields, 'main') || (
      getHasESNextField(mainFields) && getIndexOfESNextField(mainFields) < mainFields.indexOf('main')

    )
  )
}

export function getHasESNextInMainFields (options = {}) {
  const { mainFields } = options
  const usesDefaultMainFields = !mainFields
  return usesDefaultMainFields || (
    isESNextFieldBeforeMainField(mainFields)
  )
}

function getNeedBabel (pathInPkg = process.cwd(), options = {}) {
  const hasModuleInMainFields = getHasESNextInMainFields(options)
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
