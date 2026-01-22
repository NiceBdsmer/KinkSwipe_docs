import LZString from 'lz-string';

export function compressString(text: string): string {
  if (!text) return '';
  try {
    return LZString.compress(text);
  } catch (error) {
    console.error('Compression error:', error);
    return text;
  }
}

export function decompressString(compressed: string): string {
  if (!compressed) return '';
  try {
    return LZString.decompress(compressed);
  } catch (error) {
    console.error('Decompression error:', error);
    return compressed;
  }
}

export function compressActivityTexts(texts: Record<string, { text: string; desc: string }>): Record<string, string> {
  const compressed: Record<string, string> = {};

  for (const [lang, content] of Object.entries(texts)) {
    const textData = JSON.stringify({ t: content.text, d: content.desc });
    compressed[lang] = compressString(textData);
  }

  return compressed;
}

export function decompressActivityTexts(compressed: Record<string, string>): Record<string, { text: string; desc: string }> {
  const decompressed: Record<string, { text: string; desc: string }> = {};

  for (const [lang, data] of Object.entries(compressed)) {
    try {
      const textData = JSON.parse(decompressString(data));
      decompressed[lang] = { text: textData.t, desc: textData.d };
    } catch (error) {
      console.error(`Failed to decompress text for ${lang}:`, error);
      decompressed[lang] = { text: '', desc: '' };
    }
  }

  return decompressed;
}

export function compressRatings(ratings: Record<string, 'yes' | 'maybe' | 'skip' | 'no'>): string {
  const ratingMap: { [key: string]: number } = {
    'yes': 0,
    'maybe': 1,
    'skip': 2,
    'no': 3
  };

  const activityIds = Object.keys(ratings).sort();
  const bitArray: number[] = [];

  for (const id of activityIds) {
    const rating = ratings[id];
    const value = ratingMap[rating] ?? 3;
    bitArray.push(value);
  }

  const bitString = bitArray.map(b => b.toString(2).padStart(2, '0')).join('');
  return LZString.compress(bitString);
}

export function decompressRatings(
  compressed: string,
  activityIds: string[]
): Record<string, 'yes' | 'maybe' | 'skip' | 'no'> {
  const ratings: Record<string, 'yes' | 'maybe' | 'skip' | 'no'> = {};

  if (!compressed) return ratings;

  try {
    const bitString = LZString.decompress(compressed);
    if (!bitString) return ratings;

    const ratingMap: readonly string[] = ['yes', 'maybe', 'skip', 'no'] as const;

    activityIds.forEach((id, index) => {
      if (index * 2 + 2 <= bitString.length) {
        const bits = bitString.substring(index * 2, index * 2 + 2);
        const value = parseInt(bits, 2);
        ratings[id] = ratingMap[value] as 'yes' | 'maybe' | 'skip' | 'no';
      }
    });
  } catch (error) {
    console.error('Failed to decompress ratings:', error);
  }

  return ratings;
}

export function estimateCompressionRatio(original: string, compressed: string): number {
  if (!original.length) return 0;
  return Math.round((compressed.length / original.length) * 100);
}
