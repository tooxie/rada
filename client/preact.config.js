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
    if (config.mode === "development") {
      var QRcodeWebpackPlugin = require("./webpack/qrcode-webpack-plugin");
      config.devtool = "cheap-module-eval-source-map";
      config.plugins.push(new QRcodeWebpackPlugin());

      // var vConsoleWebpackPlugin = require("./webpack/vconsole-webpack-plugin");
      // config.plugins.push(new vConsoleWebpackPlugin());
    }

    if (config.mode === "production") {
      var { rule } = helpers.getLoadersByName(config, "babel-loader")[0];
      var babelConfig = rule.options;
      babelConfig.plugins.push(["babel-plugin-graphql-tag", { strip: true }]);
    }
  },
};
