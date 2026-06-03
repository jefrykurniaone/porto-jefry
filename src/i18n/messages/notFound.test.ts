import { describe, it, expect } from 'vitest';
import en from './en.json';
import id from './id.json';

describe('notFound translations', () => {
  it('should have notFound namespace in both en.json and id.json', () => {
    expect(en).toHaveProperty('notFound');
    expect(id).toHaveProperty('notFound');
  });

  it('should have all three keys (title, message, returnHome) in both locales', () => {
    const requiredKeys = ['title', 'message', 'returnHome'];
    
    requiredKeys.forEach((key) => {
      expect(en.notFound).toHaveProperty(key);
      expect(id.notFound).toHaveProperty(key);
    });
  });

  it('should have non-empty strings for all keys', () => {
    expect(en.notFound.title).toBeTruthy();
    expect(en.notFound.message).toBeTruthy();
    expect(en.notFound.returnHome).toBeTruthy();
    
    expect(id.notFound.title).toBeTruthy();
    expect(id.notFound.message).toBeTruthy();
    expect(id.notFound.returnHome).toBeTruthy();
  });

  it('should match copywriting contract from UI-SPEC', () => {
    // English strings
    expect(en.notFound.title).toBe('Page Not Found');
    expect(en.notFound.message).toBe("The page you're looking for doesn't exist or has been moved.");
    expect(en.notFound.returnHome).toBe('Return Home');
    
    // Indonesian strings
    expect(id.notFound.title).toBe('Halaman Tidak Ditemukan');
    expect(id.notFound.message).toBe('Halaman yang Anda cari tidak ada atau telah dipindahkan.');
    expect(id.notFound.returnHome).toBe('Kembali ke Beranda');
  });
});
