import { validateMessage, validateReturnTo } from '../src/utils/validation';

describe('validateMessage', () => {
  it('rejects empty messages', () => {
    expect(validateMessage('')).toEqual({
      isValid: false,
      error: expect.any(String)
    });
  });

  it('rejects non-string messages', () => {
    expect(validateMessage(123)).toEqual({
      isValid: false,
      error: expect.any(String)
    });
  });

  it('trims and validates messages', () => {
    const result = validateMessage('  test message  ');
    expect(result).toEqual({
      isValid: true,
      value: 'test message'
    });
  });

  it('rejects messages over 1000 chars', () => {
    const longMessage = 'a'.repeat(1001);
    expect(validateMessage(longMessage)).toEqual({
      isValid: false,
      error: expect.any(String)
    });
  });
});

describe('validateReturnTo', () => {
  it('accepts valid relative paths', () => {
    expect(validateReturnTo('/dashboard')).toEqual({
      isValid: true,
      value: '/dashboard'
    });
  });

  it('rejects paths without leading slash', () => {
    expect(validateReturnTo('dashboard')).toEqual({
      isValid: false,
      error: expect.any(String)
    });
  });

  it('accepts paths with query params', () => {
    expect(validateReturnTo('/dashboard?tab=profile')).toEqual({
      isValid: true,
      value: '/dashboard?tab=profile'
    });
  });

  it('rejects external URLs', () => {
    expect(validateReturnTo('https://evil.com/hack')).toEqual({
      isValid: false,
      error: expect.any(String)
    });
  });
});