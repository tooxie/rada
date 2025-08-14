declare module 'json-stable-stringify' {
  interface StringifyOptions {
    replacer?: (key: string, value: any) => any;
    space?: string | number;
    cmp?: (a: { key: string; value: any }, b: { key: string; value: any }) => number;
  }

  function stringify(value: any, opts?: StringifyOptions): string;

  // CommonJS export
  export = stringify;

  // ES module export
  export default stringify;
}
