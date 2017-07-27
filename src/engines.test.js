/* eslint-env jest */

import getEngines from './engines'

jest.mock('./package-walk', () => () => {
  throw new Error('test')
})

describe('engines', () => {
  it('throws', () => {
    console.error = jest.fn()
    expect(getEngines('/path')).toEqual({})
    expect(console.error).toHaveBeenCalledWith('/path', new Error('test'))
  })
})
