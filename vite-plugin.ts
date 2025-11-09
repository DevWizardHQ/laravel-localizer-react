import type { Plugin } from 'vite';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface LocalizerPluginOptions {
  /**
   * Command to run when lang files change
   * @default 'php artisan localizer:generate --all'
   */
  command?: string;

  /**
   * Watch paths for changes (relative to project root)
   * @default ['lang/**', 'resources/lang/**']
   */
  watch?: string[];

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;

  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounce?: number;
}

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
export function laravelLocalizer(options: LocalizerPluginOptions = {}): Plugin {
  const {
    command = 'php artisan localizer:generate --all',
    watch = ['lang/**', 'resources/lang/**'],
    debug = false,
    debounce = 300,
  } = options;

  let isGenerating = false;
  let debounceTimer: NodeJS.Timeout | null = null;

  /**
   * Execute the generation command
   */
  const generate = async (reason?: string): Promise<void> => {
    if (isGenerating) {
      if (debug) console.log('[Localizer] ⏳ Generation already in progress, skipping...');
      return;
    }

    isGenerating = true;

    try {
      if (debug) {
        const message = reason
          ? `[Localizer] 🔄 Generating translations (${reason})...`
          : '[Localizer] 🔄 Generating translations...';
        console.log(message);
      }

      const { stdout, stderr } = await execAsync(command);

      if (debug) {
        if (stdout) console.log(`[Localizer] ${stdout.trim()}`);
        if (stderr) console.warn(`[Localizer] ⚠️ ${stderr.trim()}`);
      }

      if (debug) console.log('[Localizer] ✅ Translations generated successfully');
    } catch (error) {
      console.error('[Localizer] ❌ Failed to generate translations:', error);
    } finally {
      isGenerating = false;
    }
  };

  /**
   * Debounced generation to avoid multiple rapid triggers
   */
  const debouncedGenerate = (reason?: string): void => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      generate(reason);
      debounceTimer = null;
    }, debounce);
  };

  /**
   * Check if file path matches any watch pattern
   */
  const shouldWatch = (filePath: string): boolean => {
    return watch.some((pattern) => {
      // Convert glob pattern to simple check
      const cleanPattern = pattern.replace(/\*\*/g, '').replace(/\*/g, '');
      return filePath.includes(cleanPattern);
    });
  };

  return {
    name: 'vite-plugin-laravel-localizer',

    /**
     * Generate translations on initial build
     */
    async buildStart() {
      await generate('initial build');
    },

    /**
     * Watch for changes in development mode
     */
    configureServer(server) {
      if (debug) {
        console.log('[Localizer] 👀 Watching for changes in:', watch);
      }

      server.watcher.on('change', (filePath) => {
        if (shouldWatch(filePath)) {
          if (debug) {
            const fileName = filePath.split('/').pop();
            console.log(`[Localizer] 📝 Detected change in ${fileName}`);
          }

          debouncedGenerate('file changed');
        }
      });

      server.watcher.on('add', (filePath) => {
        if (shouldWatch(filePath)) {
          if (debug) {
            const fileName = filePath.split('/').pop();
            console.log(`[Localizer] ➕ Detected new file ${fileName}`);
          }

          debouncedGenerate('file added');
        }
      });

      server.watcher.on('unlink', (filePath) => {
        if (shouldWatch(filePath)) {
          if (debug) {
            const fileName = filePath.split('/').pop();
            console.log(`[Localizer] 🗑️ Detected file deletion ${fileName}`);
          }

          debouncedGenerate('file deleted');
        }
      });
    },
  };
}

/**
 * Default export for convenience
 */
export default laravelLocalizer;
