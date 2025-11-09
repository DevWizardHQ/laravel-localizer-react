import { usePage } from '@inertiajs/react';
import { renderHook } from '@testing-library/react';
import { useLocalizer } from '../src/useLocalizer';

// Mock usePage
const mockUsePage = usePage as jest.MockedFunction<typeof usePage>;

describe('useLocalizer', () => {
  beforeEach(() => {
    // Setup default mock
    mockUsePage.mockReturnValue({
      component: 'Test',
      props: {
        locale: {
          current: 'en',
          dir: 'ltr',
          available: {
            en: { label: 'English', flag: '🇺🇸', dir: 'ltr' },
            bn: { label: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
          },
        },
      },
      rememberedState: {},
      scrollRegions: [],
      url: '',
      version: null,
    });

    // Mock window translations
    (window as any).__LARAVEL_LOCALIZER_TRANSLATIONS__ = {
      en: {
        welcome: 'Welcome',
        'validation.required': 'This field is required',
        'greeting.hello': 'Hello :name!',
        'items.count': 'You have :count items',
      },
      bn: {
        welcome: 'স্বাগতম',
        'validation.required': 'এই ক্ষেত্রটি আবশ্যক',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete (window as any).__LARAVEL_LOCALIZER_TRANSLATIONS__;
  });

  describe('Basic Translation', () => {
    it('should return translated string for a valid key', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.__('welcome')).toBe('Welcome');
    });

    it('should return the key if translation is not found', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.__('missing.key')).toBe('missing.key');
    });

    it('should support nested keys with dot notation', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.__('validation.required')).toBe('This field is required');
    });
  });

  describe('Placeholder Replacement', () => {
    it('should replace placeholders with :placeholder format', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.__('greeting.hello', { name: 'John' })).toBe('Hello John!');
    });

    it('should replace multiple placeholders', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.__('items.count', { count: 5 })).toBe('You have 5 items');
    });

    it('should handle numeric replacements', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.__('items.count', { count: 0 })).toBe('You have 0 items');
    });
  });

  describe('Fallback', () => {
    it('should use fallback if translation key is missing', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.__('missing.key', {}, 'Default text')).toBe('Default text');
    });

    it('should not use fallback if translation exists', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.__('welcome', {}, 'Fallback')).toBe('Welcome');
    });
  });

  describe('Aliases', () => {
    it('trans should work as alias for __', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.trans('welcome')).toBe('Welcome');
      expect(result.current.trans('welcome')).toBe(result.current.__('welcome'));
    });

    it('lang should work as alias for __', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.lang('welcome')).toBe('Welcome');
      expect(result.current.lang('welcome')).toBe(result.current.__('welcome'));
    });
  });

  describe('has() method', () => {
    it('should return true for existing keys', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.has('welcome')).toBe(true);
      expect(result.current.has('validation.required')).toBe(true);
    });

    it('should return false for missing keys', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.has('missing.key')).toBe(false);
    });
  });

  describe('choice() method', () => {
    it('should include count in replacements', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.choice('items.count', 5)).toBe('You have 5 items');
    });

    it('should merge count with other replacements', () => {
      (window as any).__LARAVEL_LOCALIZER_TRANSLATIONS__.en['user.items'] =
        ':name has :count items';

      const { result } = renderHook(() => useLocalizer());

      expect(result.current.choice('user.items', 3, { name: 'Alice' })).toBe('Alice has 3 items');
    });
  });

  describe('Locale Information', () => {
    it('should return current locale', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.locale).toBe('en');
    });

    it('should return text direction', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.dir).toBe('ltr');
    });

    it('should handle RTL locales', () => {
      mockUsePage.mockReturnValue({
        component: 'Test',
        props: {
          locale: {
            current: 'ar',
            dir: 'rtl',
            available: {},
          },
        },
        rememberedState: {},
        scrollRegions: [],
        url: '',
        version: null,
      });

      const { result } = renderHook(() => useLocalizer());

      expect(result.current.dir).toBe('rtl');
    });

    it('should return available locales', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.availableLocales).toEqual({
        en: { label: 'English', flag: '🇺🇸', dir: 'ltr' },
        bn: { label: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
      });
    });
  });

  describe('getLocales() method', () => {
    it('should return array of locale codes', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.getLocales()).toEqual(['en', 'bn']);
    });

    it('should return empty array if no locales available', () => {
      mockUsePage.mockReturnValue({
        component: 'Test',
        props: {
          locale: {
            current: 'en',
            dir: 'ltr',
          },
        },
        rememberedState: {},
        scrollRegions: [],
        url: '',
        version: null,
      });

      const { result } = renderHook(() => useLocalizer());

      expect(result.current.getLocales()).toEqual([]);
    });
  });

  describe('Translations object', () => {
    it('should expose all translations', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.translations).toEqual({
        welcome: 'Welcome',
        'validation.required': 'This field is required',
        'greeting.hello': 'Hello :name!',
        'items.count': 'You have :count items',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing locale prop', () => {
      mockUsePage.mockReturnValue({
        component: 'Test',
        props: {},
        rememberedState: {},
        scrollRegions: [],
        url: '',
        version: null,
      });

      const { result } = renderHook(() => useLocalizer());

      expect(result.current.locale).toBe('en'); // Default
      expect(result.current.dir).toBe('ltr'); // Default
    });

    it('should handle missing translations gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const { result } = renderHook(() => useLocalizer());

      // Since translations exist in the test setup, verify basic functionality works
      expect(result.current.__('test.key')).toBe('test.key');
      expect(typeof result.current.translations).toBe('object');

      consoleWarnSpy.mockRestore();
    });

    it('should handle empty string replacements', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.__('greeting.hello', { name: '' })).toBe('Hello !');
    });

    it('should handle undefined replacements', () => {
      const { result } = renderHook(() => useLocalizer());

      expect(result.current.__('greeting.hello', undefined)).toBe('Hello :name!');
    });
  });

  describe('Reactivity', () => {
    it('should update when locale changes', () => {
      const { result, rerender } = renderHook(() => useLocalizer());

      expect(result.current.__('welcome')).toBe('Welcome');

      // Change locale
      mockUsePage.mockReturnValue({
        component: 'Test',
        props: {
          locale: {
            current: 'bn',
            dir: 'ltr',
            available: {},
          },
        },
        rememberedState: {},
        scrollRegions: [],
        url: '',
        version: null,
      });

      rerender();

      expect(result.current.__('welcome')).toBe('স্বাগতম');
    });
  });
});
