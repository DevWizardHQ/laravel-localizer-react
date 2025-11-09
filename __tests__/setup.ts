import '@testing-library/jest-dom';

// Mock Inertia
jest.mock('@inertiajs/react', () => ({
  usePage: jest.fn(),
}));

// Setup window.localizer for tests
beforeAll(() => {
  (window as any).localizer = {
    translations: {
      en: {
        welcome: 'Welcome',
        'validation.required': 'This field is required',
        'greeting.hello': 'Hello :name!',
        'items.count': 'You have :count items',
        'user.items': ':name has :count items',
      },
      ar: {
        welcome: 'مرحبا',
        'validation.required': 'هذا الحقل مطلوب',
      },
      bn: {
        welcome: 'স্বাগতম',
        'validation.required': 'এই ক্ষেত্রটি প্রয়োজনীয়',
      },
    },
  };
});

// Suppress console errors during tests unless explicitly needed
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Not implemented: HTMLFormElement.prototype.submit')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
