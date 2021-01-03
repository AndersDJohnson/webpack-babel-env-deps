[![Codecov](https://img.shields.io/codecov/c/github/AndersDJohnson/webpack-babel-env-deps.svg)](https://codecov.io/gh/AndersDJohnson/webpack-babel-env-deps)

A webpack helper to find dependencies of your project that require transpilation with Babel (and [`@babel/preset-env`][@babel/preset-env])
by comparing your minimum Node.js engine against theirs ([`engines`][engines] in `package.json`), and/or by determining
their minimum Node.js engine or published
ES2015/ES6+ source ([`module`][module]/`jsnext:main` in `package.json`)
to require features provided by plugins and polyfills from [`@babel/preset-env`][@babel/preset-env].

This mainly aims to solve errors during minification in production builds, since some ES2015+ features like arrow functions
are unsupported by the
[native UglifyJS webpack plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) through at least `3.x`.
See [issues](#issues) below for examples of this error and affected modules.
**Update: Webpack new uses Terser rather than Uglify for minification - this example may no longer be valid.**

This module generates regular expressions to be used in the `exclude` or `include` properties
of your [`babel-loader`][babel-loader] rule in your configuration.

## Use

```js
import babelEnvDeps from 'webpack-babel-env-deps'

export default {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          babelEnvDeps.exclude() // returns /node_modules(?!(/|\\)(detect-indent|request|...)(/|\\))/
        ],
        use: {
          loader: 'babel-loader',
          // specify options here or in `.babelrc`
          options: {
            presets: [
              [
                'env',
                {
                  targets: {
                    browsers: ['> 1%, last 2 versions, Firefox ESR'],
                    uglify: true
                  }
                }
              ]
            ]
          }
        }
      }
    ]
  }
}
```

### Options

Functions `exclude` amd `include` accept an optional `options` object with following properties:

#### `mainFields`

`?array | ?boolean`

Optional. This should match your [`resolve.mainFields`](https://webpack.js.org/configuration/resolve/#resolve-mainfields)
if you specify it in your webpack config, else it assumes the default of `['browser', 'module', 'main']`.
This is used to determine modules published with ES2015+ module support as `module`/`jsnext:main`,
which by default webpack will load in preference to `main`, so that its
`engines` field might reflect `main` support rather than `module`/`jsnext:main` support,
so we must assume we must transpile the `module`/`jsnext:main` version.

If you want to disable `module`/`jsnext:main` detection, and rely only on `engines`,
you can set `mainFields` to `false` explicitly.
This would assume all dependencies with a `module`/`jsnext:main`
field point to a graph of files that are fully transpiled down
to code that can run in environments indicated by `engines`,
other than retaining ES modules syntax (for tree-shaking or other purposes).
This was the goal of the `module` field [according to Rollup](https://github.com/rollup/rollup/wiki/pkg.module),
but the `jsnext:main` field could have ambiguities ([see this write-up](https://github.com/jsforum/jsforum/issues/5#issue-113078483)),
and package authors in the wild may not always respect these conventions,
so caveat emptor!

#### `except`

`?array | ?string | ?function`

Optional. This adds exceptions to the inclusion or exclusion rules.
For example, `include({ except: ['foo'] })` will prevent `foo` from being
included for transpilation even if it would normally meet the criteria.
And `exclude({ except: ['foo'] })` will include `foo` for transpilation
even if it doesn't otherwise meet transpilation criteria.

#### `engines`

`?object | ?boolean`

Optional. This optionally overrides the `engines` key in your `package.json`.
Or set to `false` to suppress any use of your `engines` for determining dependencies to transpile.

#### `defaultEngines`

`?object | ?boolean`

Optional. Default is `false`.
This optionally provides the `engines` key when missing from any dependencies.
For example, `exclude({ defaultEngines: { 'node': '>= 4' } })` will assume that
dependencies without `engines` require node 4, and determine transpilation normally.
Or set to `true` to enable transpilation for dependencies without enough information.
For example, `exclude({ defaultEngines: true })`.

## Issues

- [https://github.com/webpack/webpack/issues/2031](https://github.com/webpack/webpack/issues/2031)
- [https://github.com/webpack/webpack/issues/2031#issuecomment-315797985](https://github.com/webpack/webpack/issues/2031#issuecomment-315797985)
- [https://github.com/webpack/webpack/issues/4296](https://github.com/webpack/webpack/issues/4296)
- [https://github.com/babel/babel-loader/issues/171](https://github.com/babel/babel-loader/issues/171)
- [https://github.com/sindresorhus/strip-indent/issues/1][strip-indent-1]
- [https://github.com/sindresorhus/pretty-bytes/issues/31](https://github.com/sindresorhus/pretty-bytes/issues/31)
- [https://github.com/sindresorhus/ama/issues/446](https://github.com/sindresorhus/ama/issues/446)
- [https://github.com/caolan/async/issues/1351](https://github.com/caolan/async/issues/1351)

## Reference

- [https://github.com/facebookincubator/create-react-app/issues/1125#issuecomment-264217076](https://github.com/facebookincubator/create-react-app/issues/1125#issuecomment-264217076)
- [https://webpack.js.org/configuration/resolve/#resolve-mainfields](https://webpack.js.org/configuration/resolve/#resolve-mainfields)
- [http://2ality.com/2017/07/npm-packages-via-babel.html](http://2ality.com/2017/07/npm-packages-via-babel.html)
- [http://2ality.com/2017/06/pkg-esnext.html](http://2ality.com/2017/06/pkg-esnext.html)
- [https://github.com/SamVerschueren/babel-engine-plugin](https://github.com/SamVerschueren/babel-engine-plugin)

[engines]: https://docs.npmjs.com/files/package.json#engines
[module]: https://github.com/rollup/rollup/wiki/pkg.module
[strip-indent-1]: https://github.com/sindresorhus/strip-indent/issues/1
[babel-loader]: https://github.com/babel/babel-loader
[@babel/preset-env]: https://github.com/babel/babel-preset-env
