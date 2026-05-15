import { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import DropZone from '../../components/DropZone';
import { trackToolUsage, trackDownload } from '../../lib/analytics';

const faqs = [
  { q: 'How much can I compress an image?', a: 'Depending on the original file, you can typically reduce image size by 40-80% with minimal visible quality loss.' },
  { q: 'Does compression affect image dimensions?', a: 'No — the image dimensions stay the same. Only the file size is reduced.' },
  { q: 'Which formats can be compressed?', a: 'JPG, PNG, and WEBP are all supported.' },
  { q: 'Is this free?', a: 'Yes, completely free with no account required.' },
];

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(75);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  function onFiles(files: File[]) {
    const f = files[0] ?? null;
    setFile(f);
    setOutputUrl(null);
    setOutputSize(null);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  function compress() {
    if (!file) return;
    setProcessing(true);
    trackToolUsage('image-compressor');
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (blob) { setOutputUrl(URL.createObjectURL(blob)); setOutputSize(blob.size); }
          setProcessing(false);
        },
        mime,
        quality / 100,
      );
    };
    img.src = URL.createObjectURL(file);
  }

  const ext = file?.name.split('.').pop() ?? 'jpg';

  return (
    <>
      <SEOHead
        title="Free Image Compressor Online – Reduce Image Size | OnlineFileTool.com"
        description="Compress images online for free. Reduce JPG, PNG, WEBP file size with a quality slider. Browser-based, private, instant results."
        canonical="https://onlinefiletool.com/image-compressor"
      />
      <ToolPageWrapper
        title="Free Image Compressor Online"
        description="Reduce your image file size while preserving visual quality. Adjust the quality slider to find the perfect balance."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Image Tools' }, { label: 'Image Compressor' }]}
        faqs={faqs}
      >
        <DropZone accept="image/*" onFiles={onFiles} label="Drop an image to compress" hint="JPG, PNG, WEBP supported" />
        {file && (
          <div className="mt-6 space-y-5">
            {preview && (
              <div className="rounded-xl overflow-hidden border border-gray-200 max-h-48 flex items-center justify-center bg-gray-50">
                <img src={preview} alt="Preview" className="max-h-48 object-contain" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality: {quality}% — Original: {(file.size / 1024).toFixed(0)} KB</label>
              <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-sky-500" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Smaller file</span><span>Higher quality</span></div>
            </div>
            <button onClick={compress} disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              {processing ? 'Compressing...' : 'Compress Image'}
            </button>
            {outputUrl && outputSize && (
              <div className="space-y-3">
                <div className="flex gap-3 text-sm">
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center"><p className="text-gray-500">Original</p><p className="font-bold text-gray-900">{(file.size / 1024).toFixed(0)} KB</p></div>
                  <div className="flex-1 bg-emerald-50 rounded-xl p-3 text-center"><p className="text-emerald-600">Compressed</p><p className="font-bold text-emerald-700">{(outputSize / 1024).toFixed(0)} KB</p></div>
                  <div className="flex-1 bg-sky-50 rounded-xl p-3 text-center"><p className="text-sky-600">Saved</p><p className="font-bold text-sky-700">{(((file.size - outputSize) / file.size) * 100).toFixed(1)}%</p></div>
                </div>
                <a href={outputUrl} download={`compressed.${ext}`} onClick={() => trackDownload('image-compressor')}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Compressed Image
                </a>
              </div>
            )}
          </div>
        )}
      </ToolPageWrapper>
    </>
  );
}
