import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  platform: "node",
  target: "node20",
  outDir: "dist",
  external: ["pg-native"],
  skipNodeModulesBundle: true,
  shims: true,
  outExtension() {
    return { js: ".mjs" };
  },
  clean: true,
  esbuildPlugins: [
    {
      name: 'rewrite-prisma',
      setup(build) {
        build.onResolve({ filter: /generated\/prisma\/index\.js$/ }, args => {
          return { path: '../src/generated/prisma/index.js', external: true }
        })
      }
    }
  ]
});