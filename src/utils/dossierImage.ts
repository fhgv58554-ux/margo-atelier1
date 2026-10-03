import html2canvas from 'html2canvas';

export async function captureDossierImage(
  element: HTMLElement,
  filename: string
): Promise<string> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#FAF8F5',
    scale: Math.min(2, window.devicePixelRatio || 2),
    useCORS: true,
    allowTaint: true,
    logging: false,
  });

  const dataUrl = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return dataUrl;
}
