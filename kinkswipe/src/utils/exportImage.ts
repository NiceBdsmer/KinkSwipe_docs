import html2canvas from 'html2canvas';

export async function exportImage(element: HTMLElement, filename = 'kinkswipe-results.png'): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#000000', // Dark background
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: false,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to export image:', error);
    throw new Error('Failed to export image');
  }
}