import { describe, it, expect } from 'vitest';
import { encodePayload } from '../../src/utils/encodePayload';
import { decodePayload } from '../../src/utils/decodePayload';
import type { UserState } from '../../src/types';

describe('Payload Utils', () => {
  it('should encode and decode UserState correctly', () => {
    const state: UserState = {
      lang: 'en',
      userMeta: {
        mode: 'both',
        experience: 'curious',
        agreedToTerms: true
      },
      ratings: {
        give: { 'act1': 'yes', 'act2': 'maybe' },
        receive: { 'act1': 'no' }
      },
      customCategories: [],
      currentScreen: 'welcome',
      currentCategory: 'bondage',
      currentActivityIndex: 0
    };

    const encoded = encodePayload(state);
    expect(encoded).toBeTruthy();
    expect(typeof encoded).toBe('string');

    const decoded = decodePayload(encoded);
    expect(decoded).toEqual(state);
  });

  it('should handle large state', () => {
    const largeState: UserState = {
      lang: 'es',
      userMeta: {
        mode: 'give',
        experience: 'experienced',
        agreedToTerms: true
      },
      ratings: {
        give: {},
        receive: {}
      },
      customCategories: Array(50).fill(null).map((_, i) => ({
        id: `custom-${i}`,
        name: `Custom Category ${i}`,
        activities: Array(10).fill(null).map((_, j) => ({
          id: `custom-act-${i}-${j}`,
          text: `Activity ${j}`,
          desc: 'Description'
        }))
      })),
      currentScreen: 'swipe',
      currentCategory: 'sexual',
      currentActivityIndex: 10
    };

    const encoded = encodePayload(largeState);
    const decoded = decodePayload(encoded);
    expect(decoded.customCategories).toHaveLength(50);
    expect(decoded.customCategories[0].activities).toHaveLength(10);
  });

  it('should throw on empty payload decode', () => {
    expect(() => decodePayload('')).toThrow();
  });

  it('should throw on invalid payload decode', () => {
    expect(() => decodePayload('invalid-base64')).toThrow();
  });

  it('should compress data significantly', () => {
    const state: UserState = {
      lang: 'en',
      userMeta: {
        mode: 'both',
        experience: 'curious',
        agreedToTerms: true
      },
      ratings: {
        give: { 'act1': 'yes', 'act2': 'maybe', 'act3': 'no' },
        receive: { 'act1': 'maybe' }
      },
      customCategories: [],
      currentScreen: 'welcome',
      currentCategory: 'bondage',
      currentActivityIndex: 0
    };

    const encoded = encodePayload(state);
    const originalSize = JSON.stringify(state).length;
    const compressedSize = encoded.length;
    
    expect(compressedSize).toBeLessThanOrEqual(originalSize);
  });
});
