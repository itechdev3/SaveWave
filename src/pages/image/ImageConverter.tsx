import { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import DropZone from '../../components/DropZone';
import { trackToolUsage, trackDownload } from '../../lib/analytics';

type Format = 'image/jpeg' | 'image/png' | 'image/webp';

const formats: { label: string; value: Format; ext: string }[] = [
  { label: 'JPG', value: 'image/jpeg', ext: 'jpg' },
  { label: 'PNG', value: 'image/png', ext: 'png' },
  { label: 'WEBP', value: 'image/webp', ext: 'webp' },
];

const faqs = [
  { q: 'Which image formats are supported?', a: 'PNG, JPG/JPEG, and WEBP conversions are fully supported in all modern browsers.' },
  { q: 'Is quality preserved during conversion?', a: 'You can control output quality. For PNG conversions, lossless quality is maintained.' },
  { q: 'Can I convert multiple images at once?', a: 'Currently each image is converted individually for maximum control and quality.' },
  { q: 'Is this free?', a: 'Yes, completely free. No account or payment required.' },
];

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>('image/jpeg');
  const [quality, setQuality] = useState(92);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  function onFiles(files: File[]) {
    const f = files[0] ?? null;
    setFile(f);
    setOutputUrl(null);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  function convert() {
    if (!file) return;
    setProcessing(true);
    trackToolUsage('image-converter');
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      if (targetFormat === 'image/png') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) setOutputUrl(URL.createObjectURL(blob));
          setProcessing(false);
        },
        targetFormat,
        quality / 100,
      );
    };
    img.src = URL.createObjectURL(file);
  }

  const ext = formats.find((f) => f.value === targetFormat)?.ext ?? 'jpg';

  return (
    <>
      <SEOHead
        title="Free Image Converter Online – PNG JPG WEBP Tool | OnlineFileTool.com"
        description="Convert images between PNG, JPG and WEBP formats for free. Browser-based, no upload, instant conversion. Works on desktop and mobile."
        canonical="https://onlinefiletool.com/image-converter"
      />
      <ToolPageWrapper
        title="Free Image Converter Online"
        description="Convert your images between PNG, JPG and WEBP formats instantly in your browser. No upload required, completely private."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Image Tools' }, { label: 'Image Converter' }]}
        faqs={faqs}
      >
        <DropZone accept="image/*" onFiles={onFiles} label="Drop an image here or click to upload" hint="Supports PNG, JPG, WEBP, GIF, BMP" />

        {file && (
          <div className="mt-6 space-y-5">
            {preview && (
              <div className="rounded-xl overflow-hidden border border-gray-200 max-h-48 flex items-center justify-center bg-gray-50">
                <img src={preview} alt="Preview" className="max-h-48 object-contain" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Convert to</label>
                <div className="flex gap-2">
                  {formats.map((f) => (
                    <button key={f.value} onClick={() => setTargetFormat(f.value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                        targetFormat === f.value ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-700 border-gray-300 hover:border-sky-300'
                      }`}
                    >{f.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality: {quality}%</label>
                <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-sky-500" />
              </div>
            </div>
            <button onClick={convert} disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              {processing ? 'Converting...' : 'Convert Image'}
            </button>
            {outputUrl && (
              <a href={outputUrl} download={`converted.${ext}`} onClick={() => trackDownload('image-converter')}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Download {ext.toUpperCase()}
              </a>
            )}
          </div>
        )}
      </ToolPageWrapper>
    </>
  );
}
