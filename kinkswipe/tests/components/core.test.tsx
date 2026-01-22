import { describe, it, expect } from 'vitest';
import { Header } from '../../src/components/Header';
import { SwipeCard } from '../../src/components/SwipeCard';
import { ActionButtons } from '../../src/components/ActionButtons';
import { CategoryProgress } from '../../src/components/CategoryProgress';
import { EdgeWarning } from '../../src/components/EdgeWarning';
import { SummaryCard } from '../../src/components/SummaryCard';

describe('Core Components', () => {
  it('should export Header component', () => {
    expect(Header).toBeDefined();
  });

  it('should export SwipeCard component', () => {
    expect(SwipeCard).toBeDefined();
  });

  it('should export ActionButtons component', () => {
    expect(ActionButtons).toBeDefined();
  });

  it('should export CategoryProgress component', () => {
    expect(CategoryProgress).toBeDefined();
  });

  it('should export EdgeWarning component', () => {
    expect(EdgeWarning).toBeDefined();
  });

  it('should export SummaryCard component', () => {
    expect(SummaryCard).toBeDefined();
  });
});
