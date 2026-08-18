// Wrangler's Text rule (see wrangler.jsonc) turns *.html imports into strings.
// This declaration is what makes that visible to TypeScript.
declare module "*.html" {
  const content: string;
  export default content;
}
