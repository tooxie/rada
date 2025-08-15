/**
 * Function that mutates the original webpack config.
 * Supports asynchronous changes when a promise is returned (or it's an async function).
 *
 * @param {object} config - original webpack config.
 * @param {object} env - options passed to the CLI.
 * @param {WebpackConfigHelpers} helpers - object with useful helpers for working with the webpack config.
 * @param {object} options - this is mainly relevant for plugins (will always be empty in the config), default to an empty object
 **/
export default function (config, env, helpers, options) {
  // Safely get babel-loader configuration
  const babelLoaders = helpers.getLoadersByName(config, "babel-loader");
  if (babelLoaders && babelLoaders.length > 0) {
    const { rule } = babelLoaders[0];
    if (rule && rule.options) {
      var babelConfig = rule.options;

      // Ensure plugins array exists
      if (!babelConfig.plugins) {
        babelConfig.plugins = [];
      }

      // Configure TypeScript to be more lenient with type checking
      if (config.module && config.module.rules) {
        config.module.rules.forEach(rule => {
          if (rule.use && rule.use.some(use => use.loader && use.loader.includes('ts-loader'))) {
            if (!rule.options) rule.options = {};
            if (!rule.options.compilerOptions) rule.options.compilerOptions = {};
            rule.options.compilerOptions.skipLibCheck = true;
            rule.options.compilerOptions.noImplicitAny = false;
            rule.options.compilerOptions.strict = false;
          }
        });
      }

      if (config.mode === "development") {
        config.devtool = "cheap-module-eval-source-map";

        babelConfig.plugins.push(["@babel/plugin-transform-react-jsx-source"]);

        // var QRcodeWebpackPlugin = require("./webpack/qrcode-webpack-plugin");
        // config.plugins.push(new QRcodeWebpackPlugin());
      } else if (config.mode === "production") {
        babelConfig.plugins.push(["babel-plugin-graphql-tag", { strip: true }]);
        delete config.devtool; // Prevent sourcemaps from being generated in prod

        var vConsoleWebpackPlugin = require("./webpack/vconsole-webpack-plugin").default;
        config.plugins.push(new vConsoleWebpackPlugin());

        config.module.rules = config.module.rules.concat({
          test: /(\.js|\.json|\.ts|\.tsx)$/,
          enforce: "pre",
          exclude: /(build|node_modules|bower_components|\.spec\.js)/,
          use: [{ loader: "webpack-strip-block" }],
        });
      }
    }
  }

  // Ensure config.node exists before setting __filename
  if (!config.node) {
    config.node = {};
  }
  config.node.__filename = true;
}
