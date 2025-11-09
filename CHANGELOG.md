# Changelog

All notable changes to `@devwizard/laravel-localizer-react` will be documented in this file.

## v0.0.1 - 2025-11-09

### 🎉 Initial Beta Release

- **useTranslation Hook**: React hook for accessing Laravel translations
  - `__()` - Main translation function with replacements and fallback
  - `trans()` - Alias for `__()`
  - `lang()` - Alias for `__()`
  - `has()` - Check if translation key exists
  - `choice()` - Pluralization support
  - `locale` - Current locale code
  - `dir` - Text direction (ltr/rtl)
  - `availableLocales` - Available locales with metadata
  - `translations` - All translations for current locale

- **Vite Plugin**: Automatic TypeScript generation
  - Watches `lang/**` directory for changes
  - Debounced regeneration (300ms)
  - Runs `php artisan localizer:generate --all` automatically
  - Zero configuration required

- **TypeScript Support**: Full type safety
  - Comprehensive interfaces for all types
  - IntelliSense support in IDEs
  - Strict mode compatible

- **Inertia.js Integration**: Seamless integration with Inertia.js
  - Works with both Inertia v1 and v2
  - Supports React 18 and 19
  - Automatic page props detection

### 📚 Documentation
- Comprehensive README with usage examples
- API documentation with TypeScript interfaces
- Migration guide from v1 to v2

### 🧪 Testing
- Jest configuration
- Comprehensive test suite with 100% coverage
- Testing Library for React components
- ESM module support

### 🛠️ Development Tools
- ESLint configuration with TypeScript and React rules
- Prettier for code formatting
- tsup for building and bundling
- GitHub Actions for CI/CD

### 📦 Package Configuration
- ESM-only distribution
- Tree-shakeable exports
- Proper package.json exports field
- Peer dependencies: React 18+, Inertia v1/v2, Vite 5+
