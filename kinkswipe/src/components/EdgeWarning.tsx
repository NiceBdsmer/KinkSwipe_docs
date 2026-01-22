import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export function EdgeWarning() {
  const t = useTranslation();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span>{t.edge.warning}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">
            {t.edge.info}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
