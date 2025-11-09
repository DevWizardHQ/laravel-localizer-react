# @devwizard/laravel-localizer-react

🌍 React integration for Laravel Localizer with Vite plugin, `useLocalizer` hook, and automatic TypeScript generation.

## Features

- ✅ **Automatic Generation**: Vite plugin watches for language file changes and regenerates TypeScript files
- ✅ **Type-Safe**: Full TypeScript support with auto-generated types
- ✅ **React Hooks**: Intuitive `useLocalizer` hook for React components
- ✅ **Customizable Path**: By default reads from `@/lang` folder, customizable via options
- ✅ **Laravel-Compatible**: Matches Laravel's translation API (`__`, `trans`, `choice`)
- ✅ **Inertia.js Integration**: Seamlessly works with Inertia.js page props
- ✅ **RTL Support**: Built-in right-to-left language support
- ✅ **Zero Dependencies**: Only peer dependencies on React and Inertia

## Installation

```bash
npm install @devwizard/laravel-localizer-react
# or
pnpm add @devwizard/laravel-localizer-react
# or
yarn add @devwizard/laravel-localizer-react
```

**Backend (Composer):**

```bash
composer require devwizardhq/laravel-localizer
php artisan localizer:install
```

The install command will:
- ✅ Publish configuration files
- ✅ Create default locale files
- ✅ Install npm package (optional)
- ✅ Generate initial TypeScript files

**Note:** You'll need to manually add the bootstrap setup (see step 1 below).

## Setup

### 1. Initialize Translations in Bootstrap

Add this to your `resources/js/bootstrap.ts`:

```typescript
import { translations } from '@/lang';

declare global {
    interface Window {
        localizer: {
            translations: Record<string, Record<string, string>>;
        };
    }
}

// Auto-initialize Laravel Localizer translations
window.localizer = {
    translations: translations,
};
```

### 2. Add Vite Plugin

Update your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { laravelLocalizer } from '@devwizard/laravel-localizer-react/vite';

export default defineConfig({
  plugins: [
    react(),
    laravelLocalizer({
      debug: true, // Enable debug logging (optional)
    }),
  ],
});
```

### 2. Add Vite Plugin

Update your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { laravelLocalizer } from '@devwizard/laravel-localizer-react/vite';

export default defineConfig({
  plugins: [
    react(),
    laravelLocalizer({
      debug: true, // Enable debug logging (optional)
    }),
  ],
});
```

### 3. Generate Translation Files

```bash
php artisan localizer:generate --all
```

This creates TypeScript files in `resources/js/lang/` directory.

## How It Works

The Laravel Localizer uses a simple and efficient approach:

1. **Generate** - PHP generates TypeScript files from Laravel language files
2. **Load** - Translations are loaded once at app startup via `window.localizer`
3. **Access** - React components access translations synchronously via `useLocalizer` hook

```
┌─────────────────┐
│  Laravel Lang   │  lang/en.json, lang/en/*.php
│     Files       │
└────────┬────────┘
         │
         │ php artisan localizer:generate
         ▼
┌─────────────────┐
│   TypeScript    │  resources/js/lang/en.ts
│     Files       │  resources/js/lang/index.ts
└────────┬────────┘
         │
         │ import { translations } from '@/lang'
         ▼
┌─────────────────┐
│ window.localizer│  { translations: { en: {...}, bn: {...} } }
│                 │
└────────┬────────┘
         │
         │ useLocalizer() hook
         ▼
┌─────────────────┐
│ React Components│  {__('welcome')}
└─────────────────┘
```

### Why `window.localizer`?

- ✅ **Synchronous Access** - No async loading delays
- ✅ **All Locales Ready** - All translations available immediately
- ✅ **Build-time Optimization** - Vite can tree-shake unused translations
- ✅ **Test-friendly** - Works in Jest/Vitest without mocking
- ✅ **No Re-renders** - No useEffect or async state updates

## Usage

### Basic Usage

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function MyComponent() {
  const { __ } = useLocalizer();

  return (
    <div>
      <h1>{__('welcome')}</h1>
      <p>{__('validation.required')}</p>
    </div>
  );
}
```

### Custom Translations Path

By default, translations are read from the `@/lang` folder (which maps to `resources/js/lang`). You can customize this path:

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function MyComponent() {
  // Use custom translations directory
  const { __ } = useLocalizer({ langPath: '@/translations' });

  return <h1>{__('welcome')}</h1>;
}
```

**Note:** Ensure your Vite config has the corresponding path alias:

```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': '/resources/js',
      '@/translations': '/resources/js/translations',
    },
  },
});
```

### With Replacements

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function Greeting() {
  const { __ } = useLocalizer();

  return (
    <div>
      <p>{__('Hello :name!', { name: 'John' })}</p>
      {/* Output: Hello John! */}
    </div>
  );
}
```

### Pluralization

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function ItemCount({ count }: { count: number }) {
  const { choice } = useLocalizer();

  return <p>{choice('items', count)}</p>;
}
```

### RTL Support

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function App() {
  const { dir, locale } = useLocalizer();

  return (
    <div dir={dir} lang={locale}>
      {/* Your app content */}
    </div>
  );
}
```

### Check Translation Exists

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function ConditionalMessage() {
  const { __, has } = useLocalizer();

  if (!has('special.message')) {
    return null;
  }

  return <p>{__('special.message')}</p>;
}
```

## API Reference

### `useLocalizer(options?)`

Main hook for accessing translations and locale information.

**Options:**

| Option     | Type     | Default    | Description                           |
| ---------- | -------- | ---------- | ------------------------------------- |
| `langPath` | `string` | `'@/lang'` | Custom path to translations directory |

**Returns:**

| Property           | Type                                        | Description                         |
| ------------------ | ------------------------------------------- | ----------------------------------- |
| `__`               | `(key, replacements?, fallback?) => string` | Main translation function           |
| `trans`            | `(key, replacements?, fallback?) => string` | Alias for `__`                      |
| `lang`             | `(key, replacements?, fallback?) => string` | Alias for `__`                      |
| `has`              | `(key) => boolean`                          | Check if translation key exists     |
| `choice`           | `(key, count, replacements?) => string`     | Pluralization support               |
| `locale`           | `string`                                    | Current locale code                 |
| `dir`              | `'ltr' \| 'rtl'`                            | Text direction                      |
| `availableLocales` | `Record<string, LocaleInfo>`                | Available locales with metadata     |
| `translations`     | `Record<string, string>`                    | All translations for current locale |
| `getLocales`       | `() => string[]`                            | Get all available locale codes      |

## Vite Plugin Options

```typescript
laravelLocalizer({
  // Command to run when lang files change
  command: 'php artisan localizer:generate --all',

  // Watch paths for changes
  watch: ['lang/**', 'resources/lang/**'],

  // Enable debug logging
  debug: false,

  // Debounce delay in milliseconds
  debounce: 300,
});
```

## Backend Integration

Ensure your Laravel backend passes locale data via Inertia:

```php
// In your HandleInertiaRequests middleware or controller

use Illuminate\Support\Facades\App;

Inertia::share([
    'locale' => [
        'current' => App::getLocale(),
        'dir' => in_array(App::getLocale(), ['ar', 'he', 'fa', 'ur']) ? 'rtl' : 'ltr',
        'available' => [
            'en' => ['label' => 'English', 'flag' => '🇺🇸', 'dir' => 'ltr'],
            'bn' => ['label' => 'বাংলা', 'flag' => '🇧🇩', 'dir' => 'ltr'],
            'ar' => ['label' => 'العربية', 'flag' => '🇸🇦', 'dir' => 'rtl'],
        ],
    ],
]);
```

## TypeScript Support

The package is fully typed. Generated translation files include TypeScript definitions:

```typescript
// Generated by localizer:generate
export const en = {
  welcome: 'Welcome',
  'validation.required': 'This field is required',
} as const;

export type TranslationKeys = keyof typeof en;
```

## License

MIT

## Credits

- [IQBAL HASAN](https://github.com/DevWizardHQ)
- [All Contributors](https://github.com/DevWizardHQ/laravel-localizer/contributors)

## Support

- [Documentation](https://github.com/DevWizardHQ/laravel-localizer)
- [Issues](https://github.com/DevWizardHQ/laravel-localizer/issues)
- [Discussions](https://github.com/DevWizardHQ/laravel-localizer/discussions)
