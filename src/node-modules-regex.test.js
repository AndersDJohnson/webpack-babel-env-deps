/* eslint-env jest */

import { include, exclude } from './node-modules-regex'

describe('node-modules-regex', () => {
  describe('include', () => {
    it('matches included', () => {
      expect('node_modules/foo/index.js').toMatch(include(['foo']))
    })

    it('does not match non-included', () => {
      expect('node_modules/bar/index.js').not.toMatch(include(['foo']))
    })

    it('empty does not match non-included', () => {
      expect('node_modules/bar/index.js').not.toMatch(include())
    })
  })

  describe('exclude', () => {
    it('does not match excluded', () => {
      expect('node_modules/foo/index.js').not.toMatch(exclude(['foo']))
    })

    it('matches non-excluded', () => {
      expect('node_modules/bar/index.js').toMatch(exclude(['foo']))
    })

    it('empty excludes all node modules', () => {
      expect('node_modules/bar/index.js').toMatch(exclude())
    })
  })
})
