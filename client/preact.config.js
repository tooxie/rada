import QRcodeWebpackPlugin from './qrcode-webpack-plugin';

export default {
  /**
   * Function that mutates the original webpack config.
   * Supports asynchronous changes when a promise is returned (or it's an async function).
   *
   * @param {object} config - original webpack config.
   * @param {object} env - options passed to the CLI.
   * @param {WebpackConfigHelpers} helpers - object with useful helpers for working with the webpack config.
   * @param {object} options - this is mainly relevant for plugins (will always be empty in the config), default to an empty object
   **/
  webpack(config, env, helpers, options) {
    let { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
    let babelConfig = rule.options;
    babelConfig.plugins.push(['babel-plugin-graphql-tag', {'strip': true}]);

    config.plugins.push(new QRcodeWebpackPlugin())
  }
}
