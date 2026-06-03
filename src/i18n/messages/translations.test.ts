import { describe, it, expect } from 'vitest';
import en from './en.json';
import id from './id.json';

describe('Error namespace translations', () => {
  it('should have error namespace in both en.json and id.json', () => {
    expect(en).toHaveProperty('error');
    expect(id).toHaveProperty('error');
  });

  it('should have all four required keys in error namespace', () => {
    const requiredKeys = ['title', 'message', 'tryAgain', 'returnHome'];
    
    requiredKeys.forEach((key) => {
      expect(en.error).toHaveProperty(key);
      expect(id.error).toHaveProperty(key);
    });
  });

  it('should have non-empty strings for all error keys', () => {
    expect(en.error.title).toBeTruthy();
    expect(en.error.message).toBeTruthy();
    expect(en.error.tryAgain).toBeTruthy();
    expect(en.error.returnHome).toBeTruthy();

    expect(id.error.title).toBeTruthy();
    expect(id.error.message).toBeTruthy();
    expect(id.error.tryAgain).toBeTruthy();
    expect(id.error.returnHome).toBeTruthy();
  });

  it('should match copywriting contract from UI spec', () => {
    // English translations
    expect(en.error.title).toBe('Something Went Wrong');
    expect(en.error.message).toBe('An unexpected error occurred. Please try refreshing the page.');
    expect(en.error.tryAgain).toBe('Try Again');
    expect(en.error.returnHome).toBe('Return Home');

    // Indonesian translations
    expect(id.error.title).toBe('Terjadi Kesalahan');
    expect(id.error.message).toBe('Terjadi kesalahan yang tidak terduga. Silakan coba muat ulang halaman.');
    expect(id.error.tryAgain).toBe('Coba Lagi');
    expect(id.error.returnHome).toBe('Kembali ke Beranda');
  });
});
