import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import hostAddress from './infra/host-address'

const dev = process.env.NODE_ENV !== 'production'
const remote = process.env.REMOTE === 'true'

export default {
  target: 'web',
  entry: './src/head.js',
  output: {
    filename: '[name].[chunkhash].js',
    publicPath: '/aframe-cards/',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /.js$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
        options: {
          presets: ['env'],
          plugins: ['transform-object-rest-spread']
        }
      },
      {
        test: /.html$/,
        use: 'html-loader?interpolate'
      },
      {
        test: /.glsl$/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'aframe-cards',
      template: './infra/template.ejs',
      // by aframe preference, inject javascript to head;
      // initialion logic goes in components.
      // scene contents are injected at build time
      inject: 'head'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module =>
        module.context && module.context.indexOf('node_modules') !== -1
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'manifest' })
  ],

  // Enable source mapping
  devtool: dev ? 'source-map' : '',

  // `npm run serve` executes the server in remote mode, which can allow testing on mobile
  // devices.
  devServer: remote
    ? {
        host: '0.0.0.0',
        allowedHosts: ['localhost', hostAddress()]
      }
    : {
        host: 'localhost'
      }
}
