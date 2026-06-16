import { describe, it, expect } from 'vitest';

describe('API Keys Validation', () => {
  it('should have API_FOOTBALL_KEY set', () => {
    const key = process.env.API_FOOTBALL_KEY;
    expect(key).toBeDefined();
    expect(key).toBe('dJp87DpQQX7bYWI3Sl7wkLqpG2vHoBjfQ6BHyxYTkLjWZolyl0VvRszoq152');
  });

  it('should have SPORTMONKS_API_KEY set', () => {
    const key = process.env.SPORTMONKS_API_KEY;
    expect(key).toBeDefined();
    expect(key).toBe('0f2333a1be189079dd4955e7b1c99d99');
  });

  it('should have ODDS_API_KEY set', () => {
    const key = process.env.ODDS_API_KEY;
    expect(key).toBeDefined();
    expect(key?.length).toBeGreaterThan(0);
  });

  it('should validate API Football key format', () => {
    const key = process.env.API_FOOTBALL_KEY;
    // API Football keys are typically alphanumeric strings
    expect(key).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it('should validate SportMonks key format', () => {
    const key = process.env.SPORTMONKS_API_KEY;
    // SportMonks keys are typically hex strings
    expect(key).toMatch(/^[a-f0-9]+$/);
  });
});
