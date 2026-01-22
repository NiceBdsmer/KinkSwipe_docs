import { encodePayload } from './encodePayload';
import type { UserState } from '../types';

export function generateShareLink(userState: UserState): string {
  const payload = encodePayload(userState);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?d=${payload}`;
}