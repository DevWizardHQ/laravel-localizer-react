# @devwizard/laravel-localizer-react

[![npm version](https://img.shields.io/npm/v/@devwizard/laravel-localizer-react.svg)](https://www.npmjs.com/package/@devwizard/laravel-localizer-react)
[![npm downloads](https://img.shields.io/npm/dm/@devwizard/laravel-localizer-react.svg)](https://www.npmjs.com/package/@devwizard/laravel-localizer-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

React integration for [Laravel Localizer](https://github.com/devwizardhq/laravel-localizer) - seamlessly use Laravel translations in your React/Inertia.js applications with full TypeScript support.

## Features

- 🎣 **React Hook** - `useLocalizer()` hook for easy translation access
- 🔌 **Vite Plugin** - Auto-regenerates TypeScript translations on file changes
- 🎯 **TypeScript** - Full type safety with TypeScript support
- ⚡ **Inertia.js** - Native integration with Inertia.js page props
- 🌐 **Pluralization** - Built-in pluralization support
- 🔄 **Replacements** - Dynamic placeholder replacement
- 🌍 **RTL Support** - Automatic text direction detection
- 📦 **Tree-shakeable** - Modern ESM build

## Requirements

- React 18 or 19
- Inertia.js v1 or v2
- Laravel Localizer backend package

## Installation

```bash
npm install @devwizard/laravel-localizer-react
```

## Backend Setup

First, install and configure the Laravel Localizer package:

```bash
composer require devwizardhq/laravel-localizer
php artisan localizer:install
```

See the [Laravel Localizer documentation](https://github.com/devwizardhq/laravel-localizer) for complete backend setup.

## Setup

### Step 1: Generate Translation Files

First, generate TypeScript translation files from your Laravel app:

```bash
php artisan localizer:generate --all
```

This creates files like `resources/js/lang/en.ts`, `resources/js/lang/fr.ts`, etc.

### Step 2: Configure Vite Plugin

Add the Vite plugin to auto-regenerate translations when language files change.

**File: `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { laravelLocalizer } from '@devwizard/laravel-localizer-react/vite';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.tsx'],
      refresh: true,
    }),
    react(),
    laravelLocalizer({
      // Watch patterns for language file changes
      patterns: ['lang/**', 'resources/lang/**'],

      // Command to run when files change
      command: 'php artisan localizer:generate --all',

      // Enable debug logging (optional)
      debug: false,
    }),
  ],
});
```

**What it does:**

- Watches for changes in `lang/**` and `resources/lang/**`
- Automatically runs `php artisan localizer:generate --all` when files change
- Triggers HMR to reload your frontend with updated translations

### Step 3: Initialize Window Translations

Set up the global `window.localizer` object in your app entry point.

**File: `resources/js/app.tsx`**

```typescript
import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// Import all generated translation files
import * as translations from './lang';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob('./Pages/**/*.tsx')
    ),
  setup({ el, App, props }) {
    // Initialize window.localizer with translations
    if (typeof window !== 'undefined') {
      window.localizer = {
        translations,
      };
    }

    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});
```

**Alternative: Create a separate file**

**File: `resources/js/lang/index.ts`**

```typescript
// Export all generated translations
export * from './en';
export * from './fr';
export * from './ar';
// ... add other locales as needed
```

**File: `resources/js/app.tsx`**

```typescript
import * as translations from './lang';

// ... in setup()
window.localizer = { translations };
```

### 3. Configure TypeScript (Optional)

Add types to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@devwizard/laravel-localizer-react"]
  }
}
```

## Usage

### Basic Usage

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function WelcomeComponent() {
  const { __ } = useLocalizer();

  return (
    <div>
      <h1>{__('welcome')}</h1>
      <p>{__('validation.required')}</p>
    </div>
  );
}
```

### With Replacements

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function GreetingComponent() {
  const { __ } = useLocalizer();

  return (
    <div>
      {/* Supports :placeholder format */}
      <p>{__('greeting', { name: 'John' })}</p>
      {/* "Hello :name!" → "Hello John!" */}

      {/* Also supports {placeholder} format */}
      <p>{__('items', { count: 5 })}</p>
      {/* "You have {count} items" → "You have 5 items" */}
    </div>
  );
}
```

### Pluralization

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function ItemCounter({ count }: { count: number }) {
  const { choice } = useLocalizer();

  return (
    <div>
      {/* Define in your translation file: */}
      {/* "apples": "no apples|one apple|many apples" */}

      <p>{choice('apples', count)}</p>
      {/* count = 0: "no apples" */}
      {/* count = 1: "one apple" */}
      {/* count = 5: "many apples" */}

      {/* With replacements */}
      <p>{choice('apples', count, { count })}</p>
      {/* "You have {count} apples" → "You have 5 apples" */}
    </div>
  );
}
```

### Checking Translation Existence

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function ConditionalTranslation() {
  const { __, has } = useLocalizer();

  return (
    <div>
      {has('welcome') && <h1>{__('welcome')}</h1>}
      {has('custom.message') ? <p>{__('custom.message')}</p> : <p>Default message</p>}
    </div>
  );
}
```

### With Fallback

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function SafeTranslation() {
  const { __ } = useLocalizer();

  return (
    <div>
      {/* Use fallback for missing keys */}
      <p>{__('might.not.exist', {}, 'Default Text')}</p>
    </div>
  );
}
```

### Locale Information

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function LocaleInfo() {
  const { locale, dir, availableLocales } = useLocalizer();

  return (
    <div dir={dir}>
      <p>Current Locale: {locale}</p>
      <p>Text Direction: {dir}</p>

      <select value={locale}>
        {Object.entries(availableLocales).map(([code, meta]) => (
          <option key={code} value={code}>
            {meta.flag} {meta.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### RTL Support

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function RTLAwareComponent() {
  const { __, dir } = useLocalizer();

  return (
    <div dir={dir} className={dir === 'rtl' ? 'text-right' : 'text-left'}>
      <h1>{__('welcome')}</h1>
      <p>{__('description')}</p>
    </div>
  );
}
```

### Accessing All Translations

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function TranslationDebugger() {
  const { translations } = useLocalizer();

  return (
    <div>
      <h2>All Translations:</h2>
      <pre>{JSON.stringify(translations, null, 2)}</pre>
    </div>
  );
}
```

## API Reference

### `useLocalizer()`

Returns an object with the following properties and methods:

| Property           | Type                                                                      | Description                         |
| ------------------ | ------------------------------------------------------------------------- | ----------------------------------- |
| `__`               | `(key: string, replacements?: Replacements, fallback?: string) => string` | Main translation function           |
| `trans`            | `(key: string, replacements?: Replacements, fallback?: string) => string` | Alias for `__()`                    |
| `lang`             | `(key: string, replacements?: Replacements, fallback?: string) => string` | Alias for `__()`                    |
| `has`              | `(key: string) => boolean`                                                | Check if translation key exists     |
| `choice`           | `(key: string, count: number, replacements?: Replacements) => string`     | Pluralization support               |
| `locale`           | `string`                                                                  | Current locale code (e.g., 'en')    |
| `dir`              | `'ltr' \| 'rtl'`                                                          | Text direction                      |
| `availableLocales` | `Record<string, LocaleMeta>`                                              | Available locales with metadata     |
| `translations`     | `Record<string, string>`                                                  | All translations for current locale |

### Vite Plugin Options

```typescript
interface LocalizerOptions {
  // Watch patterns for language file changes
  patterns?: string[]; // default: ['lang/**', 'resources/lang/**']

  // Command to run when files change
  command?: string; // default: 'php artisan localizer:generate --all'

  // Enable debug logging
  debug?: boolean; // default: false
}
```

## TypeScript Support

The package is written in TypeScript and provides full type definitions:

```typescript
import {
  useLocalizer,
  UseLocalizerReturn,
  Replacements,
  LocaleData,
  PageProps,
} from '@devwizard/laravel-localizer-react';

// All types are available for import
```

## Testing

The package includes comprehensive tests using Jest and React Testing Library:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Examples

### Language Switcher

```tsx
import { router } from '@inertiajs/react';
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function LanguageSwitcher() {
  const { locale, availableLocales } = useLocalizer();

  const changeLocale = (newLocale: string) => {
    router.visit(route('locale.switch', { locale: newLocale }), {
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <select value={locale} onChange={(e) => changeLocale(e.target.value)}>
      {Object.entries(availableLocales).map(([code, meta]) => (
        <option key={code} value={code}>
          {meta.flag} {meta.label}
        </option>
      ))}
    </select>
  );
}
```

### Form Validation

```tsx
import { useLocalizer } from '@devwizard/laravel-localizer-react';

function LoginForm() {
  const { __ } = useLocalizer();

  return (
    <form>
      <div>
        <label>{__('auth.email')}</label>
        <input type="email" required />
        <span className="error">{__('validation.required')}</span>
      </div>

      <div>
        <label>{__('auth.password')}</label>
        <input type="password" required />
      </div>

      <button type="submit">{__('auth.login')}</button>
    </form>
  );
}
```

## Complete Working Example

Here's a full example of a multilingual user dashboard:

**Backend: `lang/en.json`**

```json
{
  "welcome": "Welcome",
  "dashboard": "Dashboard",
  "greeting": "Hello, :name!",
  "notifications": "You have :count notifications"
}
```

**Backend: `lang/en/dashboard.php`**

```php
<?php

return [
    'title' => 'User Dashboard',
    'stats' => [
        'users' => '{0} No users|{1} One user|[2,*] :count users',
        'posts' => 'You have :count posts',
    ],
];
```

**Generate translations:**

```bash
php artisan localizer:generate --all
```

**Frontend: `resources/js/Pages/Dashboard.tsx`**

```tsx
import { Head } from '@inertiajs/react';
import { useLocalizer } from '@devwizard/laravel-localizer-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface DashboardProps extends PageProps {
  stats: {
    users: number;
    posts: number;
    notifications: number;
  };
}

export default function Dashboard({ auth, stats }: DashboardProps) {
  const { __, choice, locale, dir } = useLocalizer();

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          {__('dashboard.title')}
        </h2>
      }
    >
      <Head title={__('dashboard')} />

      <div className="py-12" dir={dir}>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Greeting with replacement */}
              <h1 className="text-2xl font-bold mb-4">
                {__('greeting', { name: auth.user.name })}
              </h1>

              {/* Notification count */}
              <p className="mb-4">{__('notifications', { count: stats.notifications })}</p>

              {/* Statistics with pluralization */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded">
                  <h3 className="font-semibold">Users</h3>
                  <p>{choice('dashboard.stats.users', stats.users, { count: stats.users })}</p>
                </div>

                <div className="p-4 bg-green-50 rounded">
                  <h3 className="font-semibold">Posts</h3>
                  <p>{__('dashboard.stats.posts', { count: stats.posts })}</p>
                </div>
              </div>

              {/* Locale info */}
              <div className="mt-4 text-sm text-gray-500">
                <p>Current locale: {locale}</p>
                <p>Text direction: {dir}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for recent changes.

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

## Related Packages

- [Laravel Localizer](https://github.com/devwizardhq/laravel-localizer) - Backend package
- [@devwizard/laravel-localizer-vue](https://www.npmjs.com/package/@devwizard/laravel-localizer-vue) - Vue integration

## Credits

- [IQBAL HASAN](https://github.com/iqbalhasandev)
- [All Contributors](../../contributors)
