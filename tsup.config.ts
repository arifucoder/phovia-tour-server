import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/server.ts"],
	format: ["esm"],
	target: "esnext",
	outDir: "dist",
	clean: true,
	bundle: true,
	splitting: false,
	sourcemap: true,
	banner: {
		js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
	},
	// build শেষ হলে templates copy করো
	onSuccess: "mkdir -p dist/templates && cp -r src/app/utils/templates/. dist/templates/",
});
