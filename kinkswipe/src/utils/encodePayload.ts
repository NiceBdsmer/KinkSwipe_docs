import { compressToEncodedURIComponent } from 'lz-string';
import type { UserState } from '../types';

export function encodePayload(state: UserState): string {
  try {
    const json = JSON.stringify(state);
    return compressToEncodedURIComponent(json);
  } catch (error) {
    console.error('Failed to encode payload:', error);
    throw new Error('Failed to encode state');
  }
}
