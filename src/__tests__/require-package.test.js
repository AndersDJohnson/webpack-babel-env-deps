/* eslint-env jest */

import requirePackage from '../require-package'

describe('require-package', () => {
  it('works for __non_webpack_require__', () => {
    global.__non_webpack_require__ = jest.fn()
    requirePackage('test')
    expect(global.__non_webpack_require__).toHaveBeenCalledWith(
      'test/package.json'
    )
  })
})
