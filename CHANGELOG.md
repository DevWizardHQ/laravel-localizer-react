# Changelog

All notable changes to `@devwizard/laravel-localizer-react` will be documented in this file.

## v1.0.1 - 2025-11-10

### What's Changed

- fix: bump version to 1.0.1 in package.json

**Full Changelog**: https://github.com/DevWizardHQ/laravel-localizer-vue/compare/v1.0.0...v1.0.1

## v1.0.0 - 2025-11-09

### 🎉 Initial Stable Release

This is the first stable release of Laravel Localizer React, providing seamless integration between Laravel translations and React applications.

### ✨ Features

#### useLocalizer Hook

A powerful React hook for accessing Laravel translations with full TypeScript support:

- **Translation Functions**
  
  - `__()` - Main translation function with placeholder replacement and fallback support
  - `trans()` - Alias for `__()` (Laravel compatibility)
  - `lang()` - Alias for `__()` (Laravel compatibility)
  - `has()` - Check if translation key exists
  - `choice()` - Pluralization support with replacement variables
  
- **Locale Information**
  
  - `locale` - Current locale code (e.g., 'en', 'fr')
  - `dir` - Text direction ('ltr' or 'rtl')
  - `availableLocales` - Available locales with metadata (label, flag, direction)
  - `translations` - All translations for current locale
  

#### Placeholder Replacement

- Supports both `:placeholder` and `{placeholder}` formats
- Multiple placeholders in single string
- Numeric and string replacements
- Nested placeholder support

#### Pluralization

- Laravel-compatible pluralization format
- Support for zero, one, and many forms
- Placeholder replacement in pluralized strings
- Custom count-based rules

#### Vite Plugin

Automatic TypeScript generation with hot module replacement:

- Watches language files for changes
- Non-blocking command execution
- Configurable watch patterns
- Debug logging option
- Integrates with Laravel Artisan commands

#### Inertia.js Integration

Seamless integration with Inertia.js:

- Automatic locale detection from page props
- Reactive locale updates
- Shared locale data
- RTL support via page props

### 🎯 TypeScript Support

- Full type definitions
- IntelliSense support in IDEs
- Type-safe placeholder replacements
- Strict mode compatible
- Exported types for custom implementations

### 🧪 Testing

- Comprehensive test suite with Jest
- React Testing Library integration
- 100% code coverage
- Mock Inertia.js integration
- Example test patterns

### 📦 Package Configuration

- ESM-only distribution (modern bundlers)
- Tree-shakeable exports
- Separate entry points for hook and Vite plugin
- Proper peer dependencies
- Side-effect free

### 🔧 Build System

- Built with tsup for optimal bundling
- Source maps for debugging
- Minified production builds
- Declaration files included

### � Documentation

- Complete README with examples
- API reference
- Setup guide
- Integration examples
- TypeScript usage patterns

### 🔗 Dependencies

- React 18 or 19 (peer dependency)
- Inertia.js v1 or v2 (peer dependency)
- Vite 5+ (peer dependency for plugin)
- `minimatch` for pattern matching in Vite plugin

### ⚡ Performance

- Memoized translation lookups
- Cached locale data
- Optimized re-renders
- Lazy evaluation

### 🎨 Developer Experience

- Hot module replacement in development
- Automatic regeneration on file changes
- Clear error messages
- Debug mode for troubleshooting

### 📝 Requirements

- Node.js 16+
- React 18+
- Inertia.js v1 or v2
- Laravel Localizer backend package
