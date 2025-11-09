import { exec } from 'child_process';
import { minimatch } from 'minimatch';
import osPath from 'path';
import { PluginContext } from 'rollup';
import { promisify } from 'util';
import { HmrContext, Plugin } from 'vite';

const execAsync = promisify(exec);

export interface LocalizerOptions {
  /**
   * Watch patterns for language file changes (relative to project root)
   * @default ['lang/**', 'resources/lang/**']
   */
  patterns?: string[];

  /**
   * Command to run when lang files change
   * @default 'php artisan localizer:generate --all'
   */
  command?: string;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

let context: PluginContext;

/**
 * Vite plugin for Laravel Localizer
 *
 * Automatically regenerates TypeScript translation files when Laravel language files change.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite';
 * import { laravelLocalizer } from '@devwizard/laravel-localizer-react/vite';
 *
 * export default defineConfig({
 *   plugins: [
 *     laravelLocalizer({
 *       debug: true,
 *     }),
 *   ],
 * });
 * ```
 */
export const laravelLocalizer = ({
  patterns = ['lang/**', 'resources/lang/**'],
  command = 'php artisan localizer:generate --all',
  debug = false,
}: LocalizerOptions = {}): Plugin => {
  // Normalize patterns to use forward slashes
  patterns = patterns.map((pattern) => pattern.replace(/\\/g, '/'));

  /**
   * Execute the generation command (non-blocking)
   */
  const runCommand = (): void => {
    if (debug) {
      context.info('Generating translation types...');
    }

    // Run command without awaiting to prevent blocking
    execAsync(command)
      .then(() => {
        context.info('Translation types generated successfully');
      })
      .catch((error) => {
        context.error('Error generating translation types: ' + error);
      });
  };

  return {
    name: '@devwizard/vite-plugin-laravel-localizer',
    enforce: 'pre',

    /**
     * Generate translations on initial build
     */
    buildStart() {
      context = this;
      runCommand();
    },

    /**
     * Watch for changes in development mode
     */
    handleHotUpdate({ file, server }) {
      if (shouldRun(patterns, { file, server })) {
        if (debug) {
          const fileName = file.split('/').pop();
          context.info(`Detected change in ${fileName}`);
        }

        runCommand();
      }
    },
  };
};

/**
 * Check if file path matches any watch pattern
 */
const shouldRun = (patterns: string[], opts: Pick<HmrContext, 'file' | 'server'>): boolean => {
  const file = opts.file.replaceAll('\\', '/');

  return patterns.some((pattern) => {
    pattern = osPath.resolve(opts.server.config.root, pattern).replaceAll('\\', '/');

    return minimatch(file, pattern);
  });
};

/**
 * Default export for convenience
 */
export default laravelLocalizer;
