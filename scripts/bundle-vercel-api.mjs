import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["scripts/vercel-extract-entry.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "api/extract.js",
  external: ["@vercel/node"],
  logLevel: "info",
});

console.log("Bundled API: api/extract.js");
