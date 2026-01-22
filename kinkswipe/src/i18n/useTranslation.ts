import { useAppStore } from '../store/useAppStore';
import { stringsEn } from './strings-en';
import { stringsEs } from './strings-es';
import { stringsTh } from './strings-th';
import type { Strings } from './strings-en';
import type { Language } from '../types';

const stringsMap: Record<Language, Strings> = {
  en: stringsEn,
  es: stringsEs,
  th: stringsTh
};

export function useTranslation(): Strings {
  const lang = useAppStore((state) => state.lang);
  return stringsMap[lang] ?? stringsEn;
}
