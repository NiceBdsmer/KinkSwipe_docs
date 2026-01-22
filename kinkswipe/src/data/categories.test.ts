import { describe, it, expect } from 'vitest';
import { categories } from './categories';

describe('categories', () => {
  it('should contain 9 categories', () => {
    expect(categories.length).toBe(9);
  });

  it('should contain the required category IDs', () => {
    const requiredIds = [
      'basics',
      'bondage',
      'impact',
      'sensory',
      'power-exchange',
      'edge',
      'sexual',
      'fetishes',
      'humiliation'
    ];

    const actualIds = categories.map(c => c.id);
    expect(actualIds).toEqual(expect.arrayContaining(requiredIds));
    expect(requiredIds.every(id => actualIds.includes(id))).toBe(true);
  });
});
