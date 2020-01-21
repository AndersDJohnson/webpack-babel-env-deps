/* eslint-env jest */

import path from 'path'
import {
  exclude,
  include,
  getModuleNeedsBabel,
  getPluginSatisfiesModuleRange,
  getNeedBabelFromPackageAndDependencies,
  getHasESNextInMainFields,
  getHasESNextField,
  getIndexOfESNextField,
  isESNextFieldBeforeMainField
} from '..'
import excludeFixture from '../__fixtures__/exclude'
import includeFixture from '../__fixtures__/include'

describe('index', () => {
  describe('getModuleNeedsBabel', () => {
    it('is false when no node engine', () => {
      expect(
        getModuleNeedsBabel({
          name: 'foo',
          engines: {}
        })
      ).toEqual(false)
    })

    it('is false when no node engine', () => {
      expect(
        getModuleNeedsBabel({
          name: 'foo',
          engines: {
            node: '*'
          }
        })
      ).toEqual(false)
    })

    it('is true when has module in main fields option and has module', () => {
      expect(
        getModuleNeedsBabel(
          {
            name: 'foo',
            module: 'index.js'
          },
          {
            hasEsNextInMainFields: true
          }
        )
      ).toEqual(true)
    })

    it('is true when has module in main fields option and has jsnext:main', () => {
      expect(
        getModuleNeedsBabel(
          {
            name: 'foo',
            'jsnext:main': 'index.js'
          },
          {
            hasEsNextInMainFields: true
          }
        )
      ).toEqual(true)
    })

    it('is false when has module in main fields option but no module', () => {
      expect(
        getModuleNeedsBabel(
          {
            name: 'foo'
          },
          {
            hasEsNextInMainFields: true
          }
        )
      ).toEqual(false)
    })

    it('is false when not has module in main fields option and module', () => {
      expect(
        getModuleNeedsBabel({
          name: 'foo',
          module: 'index.js'
        })
      ).toEqual(false)
    })

    it('is false when not has module in main fields option and jsnext:main', () => {
      expect(
        getModuleNeedsBabel({
          name: 'foo',
          'jsnext:main': 'index.js'
        })
      ).toEqual(false)
    })

    it('is false when not has module in main fields option and no module', () => {
      expect(
        getModuleNeedsBabel({
          name: 'foo'
        })
      ).toEqual(false)
    })
  })

  describe('getPluginSatisfiesModuleRange', () => {
    it('satisfies for plugins with no Node support', () => {
      expect(
        getPluginSatisfiesModuleRange(
          {
            chrome: '80',
            firefox: '72',
            opera: '67'
          },
          '>10'
        )
      ).toEqual(true)
    })
    it('satisfies for plugins with higher Node version', () => {
      expect(
        getPluginSatisfiesModuleRange(
          {
            chrome: '80',
            firefox: '72',
            opera: '67',
            node: '12'
          },
          '>10'
        )
      ).toEqual(true)
    })
    it('does not satisfy for plugins with lower Node version', () => {
      expect(
        getPluginSatisfiesModuleRange(
          {
            chrome: '80',
            firefox: '72',
            opera: '67',
            node: '8'
          },
          '>10'
        )
      ).toEqual(false)
    })
  })

  describe('getHasESNextInMainFields', () => {
    it('is true when default', () => {
      expect(getHasESNextInMainFields()).toBe(true)
    })

    it('is true when option passed includes module', () => {
      expect(getHasESNextInMainFields({ mainFields: ['module'] })).toBe(true)
    })

    it('is false when option passed does not include module', () => {
      expect(getHasESNextInMainFields({ mainFields: ['main'] })).toBe(false)
    })

    it('is false when option passed includes module last', () => {
      expect(getHasESNextInMainFields({ mainFields: ['main', 'module'] })).toBe(
        false
      )
    })

    it('is true when option passed includes module first', () => {
      expect(getHasESNextInMainFields({ mainFields: ['module', 'main'] })).toBe(
        true
      )
    })

    it('is false when mainFields is false', () => {
      expect(getHasESNextInMainFields({ mainFields: false })).toBe(false)
    })
  })

  describe('getHasESNextField', () => {
    it('works with no arg', () => {
      expect(getHasESNextField()).toBe(false)
    })
  })

  describe('getIndexOfESNextField', () => {
    it('works with no arg', () => {
      expect(getIndexOfESNextField()).toBe(-1)
    })

    it('works with module only', () => {
      expect(getIndexOfESNextField(['module'])).toBe(0)
    })

    it('works with module first', () => {
      expect(getIndexOfESNextField(['module', 'main'])).toBe(0)
    })

    it('works with module after', () => {
      expect(getIndexOfESNextField(['main', 'module'])).toBe(1)
    })

    it('works with jsnext:main only', () => {
      expect(getIndexOfESNextField(['jsnext:main'])).toBe(0)
    })

    it('works with jsnext:main first', () => {
      expect(getIndexOfESNextField(['jsnext:main', 'main'])).toBe(0)
    })

    it('works with jsnext:main after', () => {
      expect(getIndexOfESNextField(['main', 'jsnext:main'])).toBe(1)
    })
  })

  describe('isESNextFieldBeforeMainField', () => {
    it('works with no arg', () => {
      expect(isESNextFieldBeforeMainField()).toBe(true)
    })

    it('works with only main', () => {
      expect(isESNextFieldBeforeMainField(['main'])).toBe(false)
    })

    it('works with module before main', () => {
      expect(isESNextFieldBeforeMainField(['module', 'main'])).toBe(true)
    })

    it('works with jsnext:main before main', () => {
      expect(isESNextFieldBeforeMainField(['jsnext:main', 'main'])).toBe(true)
    })

    it('works with main before jsnext:main ', () => {
      expect(isESNextFieldBeforeMainField(['main', 'jsnext:main'])).toBe(false)
    })

    it('works with main before module ', () => {
      expect(isESNextFieldBeforeMainField(['main', 'module'])).toBe(false)
    })
  })

  describe('exclude', () => {
    it('works', () => {
      expect(exclude()).toEqual(excludeFixture)
    })

    it('works with path', () => {
      expect(
        exclude({
          path: path.join(__dirname, '..')
        })
      ).toEqual(excludeFixture)
    })

    it('works with except option', () => {
      expect(
        exclude(path.join(__dirname, '..'), {
          except: () => true
        })
      ).toEqual(excludeFixture)
    })

    it('works with defaultEngines false', () => {
      expect(exclude({ defaultEngines: false })).toEqual(excludeFixture)
    })

    it('works with defaultEngines true', () => {
      // Assume that some packages don't have engines.
      expect(exclude({ defaultEngines: true })).not.toEqual(excludeFixture)
    })

    it('works with defaultEngines node >=0.10', () => {
      expect(exclude({ defaultEngines: { node: '>=0.10' } })).toEqual(
        excludeFixture
      )
    })

    it('works with defaultEngines node >=100', () => {
      // This also forces transpilation.
      expect(exclude({ defaultEngines: { node: '>=100' } })).not.toEqual(
        excludeFixture
      )
    })
  })

  describe('include', () => {
    it('works', () => {
      expect(include()).toEqual(includeFixture)
    })

    it('works with path', () => {
      expect(
        include({
          path: path.join(__dirname, '..')
        })
      ).toEqual(includeFixture)
    })
  })

  describe('getNeedBabelFromPackageAndDependencies', () => {
    it('works', () => {
      const pkg = {}
      const dependencies = {}
      const options = {}

      const needs = getNeedBabelFromPackageAndDependencies(
        pkg,
        dependencies,
        options
      )

      expect(needs).toEqual([])
    })

    it('works with deps', () => {
      const pkg = {}
      const dependencies = {
        foo: {
          name: 'foo',
          engines: {
            node: '>=4'
          }
        }
      }
      const options = {}

      const needs = getNeedBabelFromPackageAndDependencies(
        pkg,
        dependencies,
        options
      )

      expect(needs).toEqual(['foo'])
    })

    it('works with host engines equal', () => {
      const pkg = {
        engines: {
          node: '>=4'
        }
      }
      const dependencies = {
        foo: {
          name: 'foo',
          engines: {
            node: '>=4'
          }
        }
      }
      const options = {}

      const needs = getNeedBabelFromPackageAndDependencies(
        pkg,
        dependencies,
        options
      )

      expect(needs).toEqual([])
    })

    it('works with host engines less', () => {
      const pkg = {
        engines: {
          node: '>=1'
        }
      }
      const dependencies = {
        foo: {
          name: 'foo',
          engines: {
            node: '>=4'
          }
        }
      }
      const options = {}

      const needs = getNeedBabelFromPackageAndDependencies(
        pkg,
        dependencies,
        options
      )

      expect(needs).toEqual(['foo'])
    })

    it('works with host engines greater', () => {
      const pkg = {
        engines: {
          node: '>=6'
        }
      }
      const dependencies = {
        foo: {
          name: 'foo',
          engines: {
            node: '>=4'
          }
        }
      }
      const options = {}

      const needs = getNeedBabelFromPackageAndDependencies(
        pkg,
        dependencies,
        options
      )

      expect(needs).toEqual([])
    })

    it('works with host engines overridden via options', () => {
      const pkg = {
        engines: {
          node: '>=6'
        }
      }
      const dependencies = {
        foo: {
          name: 'foo',
          engines: {
            node: '>=4'
          }
        }
      }
      const options = {
        engines: {
          node: '>=1'
        }
      }

      const needs = getNeedBabelFromPackageAndDependencies(
        pkg,
        dependencies,
        options
      )

      expect(needs).toEqual(['foo'])
    })

    it('works with host engines suppressed via options', () => {
      const pkg = {
        engines: {
          node: '>=6'
        }
      }
      const dependencies = {
        foo: {
          name: 'foo',
          engines: {
            node: '>=4'
          }
        }
      }
      const options = {
        engines: false
      }

      const needs = getNeedBabelFromPackageAndDependencies(
        pkg,
        dependencies,
        options
      )

      expect(needs).toEqual(['foo'])
    })

    it('works with host engines enabled via options', () => {
      const pkg = {
        engines: {
          node: '>=1'
        }
      }
      const dependencies = {
        foo: {
          name: 'foo',
          engines: {
            node: '>=4'
          }
        }
      }
      const options = {
        engines: true
      }

      const needs = getNeedBabelFromPackageAndDependencies(
        pkg,
        dependencies,
        options
      )

      expect(needs).toEqual(['foo'])
    })
  })
})
