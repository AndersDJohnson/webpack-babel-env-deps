import path from 'path'
import { exclude, include, getModuleNeedsBabel, getHasModuleInMainFields } from '.'
import excludeFixture from './__fixtures__/exclude'
import includeFixture from './__fixtures__/include'

describe('index', () => {
  describe('getModuleNeedsBabel', () => {
    it ('is true when has module in main fields option and has module', () => {
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

    it ('is false when has module in main fields option but no module', () => {
      expect(getModuleNeedsBabel(
        {},
        'foo',
        {
          hasModuleInMainFields: true
        }
      )).toEqual(false)
    })

    it ('is false when not has module in main fields option and module', () => {
      expect(getModuleNeedsBabel(
        {
          module: 'index.js'
        },
        'foo'
      )).toEqual(false)
    })

    it ('is false when not has module in main fields option and no module', () => {
      expect(getModuleNeedsBabel(
        {},
        'foo'
      )).toEqual(false)
    })
  })

  describe('getHasModuleInMainFields', () => {
    it('is true when default', () => {
      expect(getHasModuleInMainFields()).toBe(true)
    })

    it('is true when option passed includes module', () => {
      expect(getHasModuleInMainFields({ mainFields: ['module'] })).toBe(true)
    })

    it('is false when option passed does not include module', () => {
      expect(getHasModuleInMainFields({ mainFields: ['main'] })).toBe(false)
    })

    it('is false when option passed includes module last', () => {
      expect(getHasModuleInMainFields({ mainFields: ['main', 'module'] })).toBe(false)
    })

    it('is true when option passed includes module first', () => {
      expect(getHasModuleInMainFields({ mainFields: ['module', 'main'] })).toBe(true)
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
