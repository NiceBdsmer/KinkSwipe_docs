import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAppStore } from '../store/useAppStore';
import { decodePayload } from '../utils/decodePayload';
import { SummaryScreen } from './SummaryScreen';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { UserState } from '../types';

type LoadState = 'input' | 'loading' | 'loaded' | 'error';

export function LoadFromLink() {
  const setScreen = useAppStore((state) => state.setScreen);
  const [loadState, setLoadState] = useState<LoadState>('input');
  const [inputUrl, setInputUrl] = useState('');
  const [loadedData, setLoadedData] = useState<UserState | null>(null);
  const [error, setError] = useState<string>('');

  // Auto-load from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payload = urlParams.get('d');

    if (payload) {
      handleLoadFromPayload(payload);
    }
  }, []);

  const handleLoadFromPayload = async (payload: string) => {
    setLoadState('loading');
    setError('');

    try {
      const decodedData = decodePayload(payload);

      // Validate the decoded data has expected structure
      if (!decodedData || typeof decodedData !== 'object') {
        throw new Error('Invalid share link format. Please check the URL and try again.');
      }

      if (!decodedData.ratings || !decodedData.userMeta) {
        throw new Error('This share link is missing required data. It may be corrupted.');
      }

      setLoadedData(decodedData);
      setLoadState('loaded');
    } catch (err) {
      console.error('Failed to decode payload:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data from this link');
      setLoadState('error');
    }
  };

  const handleLoadFromUrl = () => {
    const url = new URL(inputUrl);
    const payload = url.searchParams.get('d');

    if (!payload) {
      setError('No valid KinkSwipe data found in this URL');
      setLoadState('error');
      return;
    }

    handleLoadFromPayload(payload);
  };

  const handleStartOwn = () => {
    setScreen('onboarding');
  };

  if (loadState === 'loaded' && loadedData) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto p-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Loaded Someone's Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You're viewing someone else's KinkSwipe results. This data is read-only.
              </p>
              <Button onClick={handleStartOwn} variant="outline">
                Start My Own Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Render the summary in read-only mode */}
          <div className="pointer-events-none opacity-90">
            <SummaryScreen />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pb-20">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Load Results</h1>
          <p className="text-muted-foreground">
            Paste a KinkSwipe share link to view someone's results
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Share Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <input
                type="url"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="https://kinkswipe.app/?d=..."
                value={inputUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputUrl(e.target.value)}
                disabled={loadState === 'loading'}
              />
            </div>

            {loadState === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button
              onClick={handleLoadFromUrl}
              disabled={!inputUrl.trim() || loadState === 'loading'}
              className="w-full"
            >
              {loadState === 'loading' ? 'Loading...' : 'Load Results'}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="outline" onClick={() => setScreen('welcome')}>
            Back to Welcome
          </Button>
        </div>
      </div>
    </div>
  );
}