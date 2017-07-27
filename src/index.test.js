/* eslint-env jest */

import path from 'path'
import {
  exclude,
  include,
  getModuleNeedsBabel,
  getHasESNextInMainFields,
  getHasESNextField,
  getIndexOfESNextField,
  isESNextFieldBeforeMainField
} from '.'
import excludeFixture from './__fixtures__/exclude'
import includeFixture from './__fixtures__/include'

describe('index', () => {
  describe('getModuleNeedsBabel', () => {
    it('is true when has module in main fields option and has module', () => {
      expect(getModuleNeedsBabel(
        {
          module: 'index.js'
        },
        'foo',
        {
          hasModuleInMainFields: true
        }
      )).toEqual(true)
    })

    it('is false when has module in main fields option but no module', () => {
      expect(getModuleNeedsBabel(
        {},
        'foo',
        {
          hasModuleInMainFields: true
        }
      )).toEqual(false)
    })

    it('is false when not has module in main fields option and module', () => {
      expect(getModuleNeedsBabel(
        {
          module: 'index.js'
        },
        'foo'
      )).toEqual(false)
    })

    it('is false when not has module in main fields option and no module', () => {
      expect(getModuleNeedsBabel(
        {},
        'foo'
      )).toEqual(false)
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
      expect(getHasESNextInMainFields({ mainFields: ['main', 'module'] })).toBe(false)
    })

    it('is true when option passed includes module first', () => {
      expect(getHasESNextInMainFields({ mainFields: ['module', 'main'] })).toBe(true)
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
      expect(
        exclude(path.join(__dirname, '..'))
      ).toEqual(excludeFixture)
    })
  })

  describe('include', () => {
    it('works', () => {
      expect(
        include(path.join(__dirname, '..'))
      ).toEqual(includeFixture)
    })
  })
})
