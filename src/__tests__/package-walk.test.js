/* eslint-env jest */

import walk from '../package-walk'

jest.mock('pkg-dir')

jest.mock('path', () => ({
  join: jest.fn(() => './__fixtures__/root')
}))

jest.mock('resolve-pkg', () =>
  jest.fn(() => {
    throw new Error('test')
  })
)

jest.mock('../require-package', () =>
  jest.fn(() => ({
    dependencies: {
      ok: '1.0.0'
    }
  }))
)

describe('package-walk', () => {
  describe('walk', () => {
    it('throws', () => {
      console.error = jest.fn()
      walk('/path', () => {})
      expect(console.error).toHaveBeenCalledWith('ok', new Error('test'))
    })
  })
})
