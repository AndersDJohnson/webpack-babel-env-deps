/* eslint-env jest */

import minForRange from './semver-min-for-range'

describe('semver-range-boundaries', () => {
  it('finds patch', () => {
    expect(minForRange('>=1.0.3')).toBe('1.0.3')
  })

  it('finds patch plus', () => {
    expect(minForRange('>=1.1.3')).toBe('1.1.3')
  })

  it('finds patch multi', () => {
    expect(minForRange('>=1.2.3')).toBe('1.2.3')
  })

  it('finds minor', () => {
    expect(minForRange('>=1.0.0')).toBe('1.0.0')
  })

  it('finds minor plus', () => {
    expect(minForRange('>=1.1.3')).toBe('1.1.3')
  })

  it('finds minor multi', () => {
    expect(minForRange('>=1.2.3')).toBe('1.2.3')
  })

  it('finds minor flat', () => {
    expect(minForRange('>=1.2.0')).toBe('1.2.0')
  })

  it('finds major', () => {
    expect(minForRange('>=2.0.0')).toBe('2.0.0')
  })

  it('finds major plus', () => {
    expect(minForRange('>=2.1.3')).toBe('2.1.3')
  })

  it('finds major multi', () => {
    expect(minForRange('>=2.2.3')).toBe('2.2.3')
  })

  it('finds minor flat', () => {
    expect(minForRange('>=2.0.0')).toBe('2.0.0')
  })
})
