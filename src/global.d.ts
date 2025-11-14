declare module "dynamic-form-json";

declare module "*.json" {
  const value: any;
  export default value;
}
