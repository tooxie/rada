export default class vConsoleWebpackPlugin {
  apply(compiler) {
    const mark = "<!-- vConsole -->";
    const source =
      '<script src="https://unpkg.com/vconsole/dist/vconsole.min.js">' +
      "</script><script>new window.VConsole()</script>";
    const notNull = (o, k) => !!o && !!o[k];
    const inject = (s) => (notNull(s, "replace") ? s.replace(mark, source) : s);
    const hasMark = (s) => (notNull(s, "indexOf") ? s.indexOf(mark) > -1 : s);

    compiler.hooks.compilation.tap("vConsoleWebpackPlugin", (bundle) => {
      bundle.hooks.optimizeModules.tap("vConsoleWebpackPlugin", (modules) => {
        modules.forEach((mod) => {
          if (mod._source && hasMark(mod._source._value)) {
            mod._source._value = inject(mod._source._value);
          }
        });
      });
    });
  }
}
