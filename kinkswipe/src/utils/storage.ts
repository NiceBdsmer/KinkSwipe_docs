import type { RatingValue } from '../types';
import { compressRatings, decompressRatings } from '../utils/compression';

interface CompressedUserRatings {
  compressed: string;
  activityIds: string[];
}

export function compressRatingsForStorage(ratings: Record<string, RatingValue>): CompressedUserRatings {
  const activityIds = Object.keys(ratings);
  const compressed = compressRatings(ratings);

  return {
    compressed,
    activityIds
  };
}

export function decompressRatingsFromStorage(
  storage: CompressedUserRatings | null | undefined
): Record<string, RatingValue> {
  if (!storage || !storage.compressed) return {};

  try {
    return decompressRatings(storage.compressed, storage.activityIds);
  } catch (error) {
    console.error('Failed to decompress ratings from storage:', error);
    return {};
  }
}

export function estimateStorageSavings(originalRatings: Record<string, RatingValue>) {
  const compressed = compressRatings(originalRatings);

  const originalSize = JSON.stringify(originalRatings).length;
  const compressedSize = compressed.length;

  const savings = originalSize - compressedSize;
  const percentage = Math.round((savings / originalSize) * 100);

  return { originalSize, compressedSize, savings, percentage };
}
