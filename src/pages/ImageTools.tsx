import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image, ArrowRight, ChevronRight, Download, RefreshCw } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const tools = [
  { id: 'converter', title: 'Image Converter', desc: 'Convert between PNG, JPG, WEBP and more formats' },
  { id: 'compressor', title: 'Image Compressor', desc: 'Reduce image file size without losing quality' },
  { id: 'resizer', title: 'Image Resizer', desc: 'Resize images to any dimension with presets' },
  { id: 'cropper', title: 'Image Cropper', desc: 'Crop and trim images easily' },
];

function ImageConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState(92);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setOutputUrl(null);
    setPreview(URL.createObjectURL(f));
  }

  function convert() {
    if (!file) return;
    setProcessing(true);
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
      canvas.toBlob((blob) => {
        if (blob) setOutputUrl(URL.createObjectURL(blob));
        setProcessing(false);
      }, targetFormat, quality / 100);
    };
    img.src = URL.createObjectURL(file);
  }

  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[targetFormat];

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-sky-400 transition-colors"
        onClick={() => document.getElementById('image-input')?.click()}
      >
        <Image className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="font-medium text-gray-700">Drop image or click to upload</p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP supported</p>
        <input id="image-input" type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      </div>

      {file && (
        <div className="space-y-4">
          {preview && (
            <div className="rounded-xl overflow-hidden border border-gray-200 max-h-48 flex items-center justify-center bg-gray-50">
              <img src={preview} alt="Preview" className="max-h-48 object-contain" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Convert to</label>
              <div className="flex gap-2">
                {['jpg', 'png', 'webp'].map((fmt) => (
                  <button key={fmt} onClick={() => setTargetFormat(`image/${fmt === 'jpg' ? 'jpeg' : fmt}` as any)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      targetFormat === `image/${fmt === 'jpg' ? 'jpeg' : fmt}`
                        ? 'bg-sky-500 text-white border-sky-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-sky-300'
                    }`}
                  >{fmt.toUpperCase()}</button>
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
            {processing ? 'Converting...' : 'Convert'}
          </button>
          {outputUrl && (
            <a href={outputUrl} download={`converted.${ext}`}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" /> Download
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(75);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setOutputUrl(null);
    setPreview(URL.createObjectURL(f));
  }

  function compress() {
    if (!file) return;
    setProcessing(true);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) { setOutputUrl(URL.createObjectURL(blob)); setOutputSize(blob.size); }
        setProcessing(false);
      }, 'image/jpeg', quality / 100);
    };
    img.src = URL.createObjectURL(file);
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-sky-400 transition-colors"
        onClick={() => document.getElementById('compress-input')?.click()}
      >
        <Image className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="font-medium text-gray-700">Drop image to compress</p>
        <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP supported</p>
        <input id="compress-input" type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      </div>

      {file && (
        <div className="space-y-4">
          {preview && (
            <div className="rounded-xl overflow-hidden border border-gray-200 max-h-48 flex items-center justify-center bg-gray-50">
              <img src={preview} alt="Preview" className="max-h-48 object-contain" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality: {quality}% — Original: {(file.size / 1024).toFixed(0)} KB</label>
            <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-sky-500" />
          </div>
          <button onClick={compress} disabled={processing}
            className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
            {processing ? 'Compressing...' : 'Compress'}
          </button>
          {outputUrl && outputSize && (
            <div className="space-y-3">
              <div className="flex gap-3 text-sm">
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center"><p className="text-gray-500">Original</p><p className="font-bold text-gray-900">{(file.size / 1024).toFixed(0)} KB</p></div>
                <div className="flex-1 bg-emerald-50 rounded-xl p-3 text-center"><p className="text-emerald-600">Compressed</p><p className="font-bold text-emerald-700">{(outputSize / 1024).toFixed(0)} KB</p></div>
                <div className="flex-1 bg-sky-50 rounded-xl p-3 text-center"><p className="text-sky-600">Saved</p><p className="font-bold text-sky-700">{(((file.size - outputSize) / file.size) * 100).toFixed(1)}%</p></div>
              </div>
              <a href={outputUrl} download={`compressed.jpg`}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ImageTools() {
  const [activeTool, setActiveTool] = useState<string>('converter');

  return (
    <>
      <SEOHead
        title="Free Image Tools Online – Convert, Compress & Resize Images"
        description="Free online image converter, compressor and resizer. Convert PNG to JPG, compress images, resize for social media. No signup needed."
      />

      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Image Tools</span>
          </div>
        </div>

        {/* Header */}
        <section className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <Image className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Image Tools</h1>
            </div>
            <p className="text-lg text-sky-100">
              Free online tools for converting, compressing, and resizing images
            </p>
          </div>
        </section>

        {/* Tool Tabs */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {tools.map(({ id, title, desc }) => (
              <button key={id} onClick={() => setActiveTool(id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  activeTool === id
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-gray-200 hover:border-sky-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-xs text-gray-600 mt-1">{desc}</p>
              </button>
            ))}
          </div>

          {/* Active Tool */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            {activeTool === 'converter' && <ImageConverterTool />}
            {activeTool === 'compressor' && <ImageCompressorTool />}
            {activeTool === 'resizer' && (
              <div className="text-center py-12 text-gray-500">
                <p className="font-medium">Image Resizer coming soon</p>
              </div>
            )}
            {activeTool === 'cropper' && (
              <div className="text-center py-12 text-gray-500">
                <p className="font-medium">Image Cropper coming soon</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-100 py-12 mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need other file tools?</h2>
            <p className="text-gray-600 mb-8">Explore our full suite of free online tools for audio, PDF, and more</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Back to Home <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
