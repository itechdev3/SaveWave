import { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import DropZone from '../../components/DropZone';
import { trackToolUsage, trackDownload } from '../../lib/analytics';

const presets = [
  { label: 'Instagram Post', w: 1080, h: 1080 },
  { label: 'Instagram Story', w: 1080, h: 1920 },
  { label: 'YouTube Thumbnail', w: 1280, h: 720 },
  { label: 'WhatsApp DP', w: 500, h: 500 },
  { label: 'Facebook Cover', w: 820, h: 312 },
  { label: 'Twitter Header', w: 1500, h: 500 },
];

const faqs = [
  { q: 'Does resizing reduce quality?', a: 'Resizing can reduce quality if you upscale beyond original resolution. Downscaling maintains quality well.' },
  { q: 'Can I keep the aspect ratio?', a: 'Yes — enable the "Keep aspect ratio" option to prevent distortion.' },
  { q: 'What presets are available?', a: 'We include presets for Instagram, YouTube, WhatsApp, Facebook, and Twitter optimal sizes.' },
  { q: 'Is this free?', a: 'Completely free — no account or subscription needed.' },
];

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [keepRatio, setKeepRatio] = useState(true);
  const [origSize, setOrigSize] = useState({ w: 0, h: 0 });
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  function onFiles(files: File[]) {
    const f = files[0] ?? null;
    setFile(f);
    setOutputUrl(null);
    if (!f) { setPreview(null); return; }
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new window.Image();
    img.onload = () => {
      setOrigSize({ w: img.width, h: img.height });
      setWidth(String(img.width));
      setHeight(String(img.height));
    };
    img.src = url;
  }

  function onWidthChange(v: string) {
    setWidth(v);
    if (keepRatio && origSize.w && v) setHeight(String(Math.round((Number(v) / origSize.w) * origSize.h)));
  }

  function onHeightChange(v: string) {
    setHeight(v);
    if (keepRatio && origSize.h && v) setWidth(String(Math.round((Number(v) / origSize.h) * origSize.w)));
  }

  function applyPreset(p: { w: number; h: number }) { setWidth(String(p.w)); setHeight(String(p.h)); setKeepRatio(false); }

  function resize() {
    if (!file || !width || !height) return;
    setProcessing(true);
    trackToolUsage('image-resizer');
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Number(width);
      canvas.height = Number(height);
      canvas.getContext('2d')!.drawImage(img, 0, 0, Number(width), Number(height));
      canvas.toBlob((blob) => {
        if (blob) setOutputUrl(URL.createObjectURL(blob));
        setProcessing(false);
      }, 'image/jpeg', 0.92);
    };
    img.src = URL.createObjectURL(file);
  }

  return (
    <>
      <SEOHead
        title="Free Image Resizer Online – Resize PNG JPG WEBP | OnlineFileTool.com"
        description="Resize images online for free. Use social media presets for Instagram, YouTube, WhatsApp. Browser-based, no upload needed."
        canonical="https://onlinefiletool.com/image-resizer"
      />
      <ToolPageWrapper
        title="Free Image Resizer Online"
        description="Resize images to any dimension or use our social media presets for Instagram, YouTube, WhatsApp and more."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Image Tools' }, { label: 'Image Resizer' }]}
        faqs={faqs}
      >
        <DropZone accept="image/*" onFiles={onFiles} label="Drop an image to resize" hint="Supports PNG, JPG, WEBP" />
        {file && (
          <div className="mt-6 space-y-5">
            {preview && (
              <div className="rounded-xl overflow-hidden border border-gray-200 max-h-40 flex items-center justify-center bg-gray-50">
                <img src={preview} alt="Preview" className="max-h-40 object-contain" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Quick Presets</p>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button key={p.label} onClick={() => applyPreset(p)}
                    className="text-xs bg-gray-100 hover:bg-sky-50 hover:text-sky-700 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-sky-200 transition-colors"
                  >{p.label} ({p.w}x{p.h})</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                <input type="number" value={width} onChange={(e) => onWidthChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                <input type="number" value={height} onChange={(e) => onHeightChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} className="accent-sky-500 w-4 h-4" />
              Keep aspect ratio
            </label>
            <button onClick={resize} disabled={processing || !width || !height}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              {processing ? 'Resizing...' : 'Resize Image'}
            </button>
            {outputUrl && (
              <a href={outputUrl} download={`resized_${width}x${height}.jpg`} onClick={() => trackDownload('image-resizer')}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Download Resized Image
              </a>
            )}
          </div>
        )}
      </ToolPageWrapper>
    </>
  );
}
