/* eslint-env jest */

import normalizeSemver from '../semver-normalize'

describe('normalizeSemver', () => {
  it('1', () => {
    expect(normalizeSemver('1')).toBe('1.0.0')
  })
  it('2', () => {
    expect(normalizeSemver('1.0')).toBe('1.0.0')
  })
  it('3', () => {
    expect(normalizeSemver('1.0.0')).toBe('1.0.0')
  })
})
