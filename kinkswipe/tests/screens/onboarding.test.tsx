import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Onboarding } from '../../src/screens/Onboarding';

describe('Onboarding', () => {
  it('should export Onboarding component', () => {
    expect(Onboarding).toBeDefined();
  });
});
