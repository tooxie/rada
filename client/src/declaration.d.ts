declare module "*.gif";
declare module "*.css" {
  const mapping: Record<string, string>;
  export default mapping;
}
