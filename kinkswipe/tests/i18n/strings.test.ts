import { describe, it, expect } from 'vitest';
import { stringsEn } from '../../src/i18n/strings-en';
import { stringsEs } from '../../src/i18n/strings-es';
import { stringsTh } from '../../src/i18n/strings-th';
import type { Strings } from '../../src/i18n/strings-en';

function hasAllKeys(source: Strings, target: Strings, lang: string): boolean {
  const checkObject = (srcObj: Record<string, unknown>, tgtObj: Record<string, unknown>): void => {
    for (const key of Object.keys(srcObj)) {
      if (!(key in tgtObj)) {
        throw new Error(`Missing key in ${lang}: ${key}`);
      }
      if (typeof srcObj[key] === 'object' && srcObj[key] !== null) {
        checkObject(srcObj[key] as Record<string, unknown>, tgtObj[key] as Record<string, unknown>);
      }
    }
  };

  checkObject(source, target);
  return true;
}

describe('i18n Strings', () => {
  it('Spanish should have all keys from English', () => {
    const result = hasAllKeys(stringsEn, stringsEs, 'es');
    expect(result).toBe(true);
  });

  it('Thai should have all keys from English', () => {
    const result = hasAllKeys(stringsEn, stringsTh, 'th');
    expect(result).toBe(true);
  });

  it('English should have all required sections', () => {
    expect(stringsEn.welcome).toBeDefined();
    expect(stringsEn.onboarding).toBeDefined();
    expect(stringsEn.swipe).toBeDefined();
    expect(stringsEn.summary).toBeDefined();
    expect(stringsEn.edge).toBeDefined();
    expect(stringsEn.categories).toBeDefined();
  });
});
