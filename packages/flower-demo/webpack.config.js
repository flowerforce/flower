const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin')
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin')
const { join } = require('path')

module.exports = {
  output: {
    path: join(__dirname, './dist/flower-demo')
  },
  devServer: {
    port: 4200
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/index.tsx',
      index: './public/index.html',
      baseHref: '/',
      assets: ['./public/favicon.ico'],
      styles: [],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production'
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    })
  ]
}
