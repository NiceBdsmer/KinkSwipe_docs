import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTranslation } from '../i18n/useTranslation';

interface SummaryCardProps {
  yesCount: number;
  maybeCount: number;
  mehCount: number;
  nopeCount: number;
}

export function SummaryCard({ yesCount, maybeCount, mehCount, nopeCount }: SummaryCardProps) {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.summary.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t.summary.yesCount}</span>
            <span className="px-3 py-1 rounded-full bg-green-600 text-white text-sm font-semibold">
              {yesCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t.summary.maybeCount}</span>
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold">
              {maybeCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t.summary.mehCount}</span>
            <span className="px-3 py-1 rounded-full bg-gray-600 text-white text-sm font-semibold">
              {mehCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t.summary.nopeCount}</span>
            <span className="px-3 py-1 rounded-full bg-red-600 text-white text-sm font-semibold">
              {nopeCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
