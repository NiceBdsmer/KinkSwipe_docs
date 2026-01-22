import { Button } from './ui/button';
import { useAppStore } from '../store/useAppStore';
import type { Language } from '../types';

export function LanguageSwitcher() {
  const lang = useAppStore((state) => state.lang);
  const setLang = useAppStore((state) => state.setLang);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'th', label: 'TH' }
  ];

  return (
    <div className="flex gap-2">
      {languages.map((language) => (
        <Button
          key={language.code}
          variant={lang === language.code ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLang(language.code)}
          className="rounded-full"
        >
          {language.label}
        </Button>
      ))}
    </div>
  );
}
