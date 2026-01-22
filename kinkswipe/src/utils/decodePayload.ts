import { decompressFromEncodedURIComponent } from 'lz-string';
import type { UserState } from '../types';

export function decodePayload(encoded: string): UserState {
  if (!encoded) {
    throw new Error('No payload provided');
  }

  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) {
      throw new Error('Failed to decompress payload');
    }
    const parsed = JSON.parse(json);
    return parsed as UserState;
  } catch (error) {
    console.error('Failed to decode payload:', error);
    throw new Error('Failed to decode payload');
  }
}
