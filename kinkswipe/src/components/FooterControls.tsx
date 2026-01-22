import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function FooterControls() {
  return (
    <div className="flex flex-col items-center gap-4">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}