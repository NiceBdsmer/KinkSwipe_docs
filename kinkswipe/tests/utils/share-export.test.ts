import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateShareLink } from '../../src/utils/generateShareLink';
import { exportText } from '../../src/utils/exportText';

// Mock encodePayload
vi.mock('../../src/utils/encodePayload', () => ({
  encodePayload: vi.fn(() => 'mocked-encoded-payload')
}));

// Mock window.location
const mockLocation = {
  origin: 'https://kinkswipe.app',
  pathname: '/',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('Share and Export Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateShareLink', () => {
    it('should generate a share link with encoded payload', () => {
      const userState = {
        ratings: { give: {}, receive: {} },
        userMeta: { mode: 'give', experience: 'newbie', agreedToTerms: true },
        lang: 'en',
        version: '1.0'
      };

      const result = generateShareLink(userState);

      expect(result).toBe('https://kinkswipe.app/?d=mocked-encoded-payload');
    });

    it('should handle different origins and paths', () => {
      mockLocation.origin = 'https://example.com';
      mockLocation.pathname = '/app';

      const userState = {
        ratings: { give: {}, receive: {} },
        userMeta: { mode: 'give', experience: 'newbie', agreedToTerms: true },
        lang: 'en',
        version: '1.0'
      };

      const result = generateShareLink(userState);

      expect(result).toBe('https://example.com/app?d=mocked-encoded-payload');
    });
  });

  describe('exportText', () => {
    it('should generate text summary for single mode', () => {
      const ratings = {
        give: {
          'rope-bondage': 'yes' as const,
          'handcuffs': 'maybe' as const,
          'blindfolds': 'no' as const
        },
        receive: {}
      };

      const result = exportText(ratings);

      expect(result).toContain('BONDAGE');
      expect(result).toContain('GIVE:');
      expect(result).toContain('YES: Rope Bondage');
      expect(result).toContain('MAYBE: Handcuffs');
      expect(result).toContain('NO: Blindfolds');
    });

    it('should generate text summary for both modes', () => {
      const ratings = {
        give: {
          'rope-bondage': 'yes' as const
        },
        receive: {
          'handcuffs': 'maybe' as const
        }
      };

      const result = exportText(ratings);

      expect(result).toContain('GIVE:');
      expect(result).toContain('YES: Rope Bondage');
      expect(result).toContain('RECEIVE:');
      expect(result).toContain('MAYBE: Handcuffs');
    });

    it('should skip categories with no ratings', () => {
      const ratings = {
        give: {
          'rope-bondage': 'yes' as const
        },
        receive: {}
      };

      const result = exportText(ratings);

      expect(result).toContain('BONDAGE');
      expect(result).not.toContain('IMPACT');
      expect(result).not.toContain('SENSORY');
    });

    it('should return empty string for no ratings', () => {
      const ratings = {
        give: {},
        receive: {}
      };

      const result = exportText(ratings);

      expect(result).toBe('');
    });
  });
});