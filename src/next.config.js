const path = require('path');
const withStylus = require('@zeit/next-stylus')
    , withTypescript = require('@zeit/next-typescript')
    , ForkTsCheckWebpackPlugin = require('fork-ts-checker-webpack-plugin')
    ;

module.exports = withTypescript(withStylus({
  distDir: '../.build' // instead `.next`
, webpack: (config, {isDevelopment, isServer}) => {

    if (isServer) {
      config.plugins.push(new ForkTsCheckWebpackPlugin({
        tsconfig: path.resolve(__dirname, '..', 'tsconfig.json')
      }));
    }

    if (isDevelopment) {
      return config;
    }

    config.resolve.alias = {
      ...(config.resolve.alias || {}),

      'react': 'inferno-compat'
    , 'react-dom': 'inferno-compat'
    };
    return config;
  }
}));
