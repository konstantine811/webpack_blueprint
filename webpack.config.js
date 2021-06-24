const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';

const PATHS = {
  pugPages: 'src/pug/pages/',
};

const PAGES_DIR = path.join(__dirname, PATHS.pugPages);
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter((fileName) => fileName.endsWith('.pug'));

const pug = {
  test: /\.pug$/,
  use: [
    'html-loader',
    {
      loader: 'pug-html-loader',
      options: {
        pretty: true,
      },
    },
  ],
};

const html = {
  test: /\.html$/,
  use: [
    {
      loader: 'html-loader',
    },
  ],
};

module.exports = {
  entry: './src/index.ts',
  devtool: mode === 'development' ? 'inline-source-map' : false,
  mode: mode,
  target: 'web',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          'sass-loader',
        ],
      },
      pug,
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
    open: true,
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    /* new HtmlWebpackPlugin({
      template: './src/index.html',
    }), */
    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `./${page.replace(/\.pug/, '.html')}`,
        })
    ),
    new HtmlWebpackPugPlugin(),
    new MiniCssExtractPlugin({
      filename: mode ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: mode ? '[id].css' : '[id].[contenthash].css',
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
