import { Button } from '../components/ui/button';
import { FooterControls } from '../components/FooterControls';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n/useTranslation';
import { Shield, Sparkles, Users } from 'lucide-react';

export function Start() {
  const t = useTranslation();
  const setScreen = useAppStore((state) => state.setScreen);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 safe-area-inset app-shell">
      <div className="w-full max-w-3xl text-center space-y-8">
        <div className="space-y-3 animate-fade-up">
          <span className="soft-pill uppercase tracking-[0.2em]">{t.start.badge}</span>
          <h1 className="text-4xl sm:text-5xl font-display text-foreground">{t.start.title}</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.start.subtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 text-left">
          {[
            {
              icon: <Shield className="h-5 w-5 text-emerald-300" />,
              title: t.start.cards.safeTitle,
              text: t.start.cards.safeText
            },
            {
              icon: <Sparkles className="h-5 w-5 text-sky-300" />,
              title: t.start.cards.discoverTitle,
              text: t.start.cards.discoverText
            },
            {
              icon: <Users className="h-5 w-5 text-orange-300" />,
              title: t.start.cards.shareTitle,
              text: t.start.cards.shareText
            }
          ].map((card) => (
            <div key={card.title} className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                {card.icon}
                <h3 className="font-semibold text-foreground">{card.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            onClick={() => setScreen('onboarding')}
            size="lg"
            className="rounded-full px-6 text-base"
          >
            {t.start.primaryCta}
          </Button>
          <Button
            onClick={() => setScreen('welcome')}
            variant="secondary"
            size="lg"
            className="rounded-full px-6 text-base"
          >
            {t.start.secondaryCta}
          </Button>
          <Button
            onClick={() => setScreen('load')}
            variant="ghost"
            size="lg"
            className="rounded-full px-6 text-base"
          >
            {t.start.tertiaryCta}
          </Button>
        </div>

        <div className="pt-4">
          <FooterControls />
        </div>
      </div>
    </div>
  );
}
