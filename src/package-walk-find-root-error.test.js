/* eslint-env jest */

import walk from './package-walk'

jest.mock('find-root', () => jest.fn(() => { throw new Error('test') }))

jest.mock('path', () => ({
  join: jest.fn(() => './__fixtures__/root')
}))

jest.mock('resolve', () => ({
  sync: jest.fn(() => 'ok')
}))

jest.mock('./require-package', () => jest.fn(() => ({
  dependencies: {
    ok: '1.0.0'
  }
})))

describe('package-walk', () => {
  describe('walk', () => {
    it('throws', () => {
      console.error = jest.fn()
      walk('/path', () => {})
      expect(console.error).toHaveBeenCalledWith('/path', new Error('test'))
    })
  })
})
