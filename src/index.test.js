import path from 'path'
import { exclude, include } from '.'
import excludeFixture from './__fixtures__/exclude'
import includeFixture from './__fixtures__/include'

describe('index', () => {
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
