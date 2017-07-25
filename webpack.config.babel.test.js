import config from './webpack.config.babel'
import excludeFixture from './src/__fixtures__/exclude'

test('webpack config', () => {
  expect(
    config.module.rules[0].exclude[0]
  ).toEqual(excludeFixture)
})
