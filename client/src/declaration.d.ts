declare module "*.gif";
declare module "*.svg";
declare module "*.css" {
  const mapping: Record<string, string>;
  export default mapping;
}
