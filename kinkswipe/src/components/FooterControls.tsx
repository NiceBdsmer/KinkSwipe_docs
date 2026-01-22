import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function FooterControls() {
  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <div className="scale-90 sm:scale-100">
        <LanguageSwitcher />
      </div>
      <ThemeToggle />
    </div>
  );
}