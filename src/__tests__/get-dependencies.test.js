/* eslint-env jest */

import getDependencies from '../get-dependencies'

jest.mock('../package-walk', () => () => {
  throw new Error('test')
})

describe('get-dependencies', () => {
  it('throws', () => {
    console.error = jest.fn()
    expect(getDependencies('/path')).toEqual({})
    expect(console.error).toHaveBeenCalledWith('/path', new Error('test'))
  })
})
