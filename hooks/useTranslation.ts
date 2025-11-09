/**
 * Laravel Localizer - Translation Helper for React
 *
 * This file provides React hooks and utilities for using Laravel translations
 * in your React/Inertia.js application.
 *
 * @example
 * ```tsx
 * import { useTranslation } from '@devwizard/laravel-localizer-react';
 *
 * function MyComponent() {
 *   const { __, trans, locale, dir } = useTranslation();
 *
 *   return (
 *     <div dir={dir}>
 *       <h1>{__('welcome')}</h1>
 *       <p>{__('validation.required')}</p>
 *     </div>
 *   );
 * }
 * ```
 */

import { usePage } from '@inertiajs/react';
import { useMemo, useCallback } from 'react';

/**
 * Translation replacements
 */
export type Replacements = Record<string, string | number>;

/**
 * Locale metadata
 */
export interface LocaleData {
  current: string;
  dir: 'ltr' | 'rtl';
  available?: Record<
    string,
    {
      label: string;
      flag: string;
      dir: 'ltr' | 'rtl';
    }
  >;
}

/**
 * Page props with locale data
 */
export interface PageProps extends Record<string, unknown> {
  locale?: LocaleData;
}

/**
 * Translation hook return type
 */
export interface UseTranslationReturn {
  /**
   * Main translation function
   */
  __: (key: string, replacements?: Replacements, fallback?: string) => string;

  /**
   * Alias for __ function (Laravel compatibility)
   */
  trans: (key: string, replacements?: Replacements, fallback?: string) => string;

  /**
   * Alias for __ function (Laravel compatibility)
   */
  lang: (key: string, replacements?: Replacements, fallback?: string) => string;

  /**
   * Check if a translation key exists
   */
  has: (key: string) => boolean;

  /**
   * Get translation with pluralization support
   */
  choice: (key: string, count: number, replacements?: Replacements) => string;

  /**
   * Current locale code
   */
  locale: string;

  /**
   * Text direction ('ltr' or 'rtl')
   */
  dir: 'ltr' | 'rtl';

  /**
   * Available locales with metadata
   */
  availableLocales: Record<string, { label: string; flag: string; dir: 'ltr' | 'rtl' }>;

  /**
   * All translations for current locale
   */
  translations: Record<string, string>;

  /**
   * Get all available locale codes
   */
  getLocales: () => string[];
}

/**
 * Replace placeholders in translation strings
 *
 * Supports both :placeholder and {placeholder} formats
 *
 * @example
 * replacePlaceholders('Hello :name!', { name: 'John' })
 * // Returns: "Hello John!"
 *
 * replacePlaceholders('Hello {name}!', { name: 'John' })
 * // Returns: "Hello John!"
 */
function replacePlaceholders(text: string, replacements?: Replacements): string {
  if (!replacements) return text;

  return Object.entries(replacements).reduce((result, [key, value]) => {
    // Support both :key and {key} formats
    result = result.replace(new RegExp(`:${key}\\b`, 'g'), String(value));
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    return result;
  }, text);
}

/**
 * React hook for translations
 *
 * @returns Translation utilities and locale information
 *
 * @example
 * ```tsx
 * import { useTranslation } from '@devwizard/laravel-localizer-react';
 *
 * function MyComponent() {
 *   const { __, trans, lang, locale, dir } = useTranslation();
 *
 *   return (
 *     <div dir={dir}>
 *       <h1>{__('welcome')}</h1>
 *       <p>{trans('greeting', { name: 'John' })}</p>
 *       <p>{lang('validation.required')}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTranslation(): UseTranslationReturn {
  const { props } = usePage<PageProps>();
  const locale = props.locale?.current || 'en';
  const dir = props.locale?.dir || 'ltr';
  
  const availableLocales = useMemo(
    () => props.locale?.available || {},
    [props.locale?.available]
  );

  // Dynamically import translations from generated files
  // Note: Users need to set up path alias '@/lang' -> 'resources/js/lang'
  // The actual translations object will be available at runtime
  const translations = useMemo<Record<string, string>>(() => {
    try {
      // This will be resolved at build time by Vite
      // The generated files are created by php artisan localizer:generate
      interface WindowWithTranslations extends Window {
        __LARAVEL_LOCALIZER_TRANSLATIONS__?: Record<string, Record<string, string>>;
      }
      return (window as WindowWithTranslations).__LARAVEL_LOCALIZER_TRANSLATIONS__?.[locale] || {};
    } catch {
      console.warn(`[Laravel Localizer] Could not load translations for locale: ${locale}`);
      return {};
    }
  }, [locale]);

  /**
   * Main translation function
   */
  const __ = useCallback(
    (key: string, replacements?: Replacements, fallback?: string): string => {
      const text = translations[key] || fallback || key;
      return replacePlaceholders(String(text), replacements);
    },
    [translations]
  );

  /**
   * Alias for __ function (Laravel compatibility)
   */
  const trans = __;

  /**
   * Alias for __ function (Laravel compatibility)
   */
  const lang = __;

  /**
   * Check if a translation key exists
   */
  const has = useCallback(
    (key: string): boolean => {
      return key in translations;
    },
    [translations]
  );

  /**
   * Get translation with pluralization support
   */
  const choice = useCallback(
    (key: string, count: number, replacements?: Replacements): string => {
      const merged = { ...replacements, count };
      return __(key, merged);
    },
    [__]
  );

  /**
   * Get all available locale codes
   */
  const getLocales = useCallback((): string[] => {
    return Object.keys(availableLocales);
  }, [availableLocales]);

  return {
    __,
    trans,
    lang,
    has,
    choice,
    locale,
    dir,
    availableLocales,
    translations,
    getLocales,
  };
}
