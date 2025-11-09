import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'vite-plugin': 'src/vite-plugin-laravel-localizer.ts',
  },
  format: ['esm'],
  dts: {
    resolve: true,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', '@inertiajs/react', 'vite'],
  treeshake: true,
  minify: false,
  target: 'es2022',
  outExtension() {
    return {
      js: '.js',
    };
  },
  bundle: true,
  keepNames: true,
});
