import { useState, useRef, useCallback } from 'react';
import { Download, Crop } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import DropZone from '../../components/DropZone';
import { trackToolUsage, trackDownload } from '../../lib/analytics';

const ratios = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:4', value: 3 / 4 },
  { label: '9:16', value: 9 / 16 },
];

const faqs = [
  { q: 'Can I crop to a specific aspect ratio?', a: 'Yes — select from free crop, 1:1, 4:3, 16:9, 3:4, or 9:16 ratios.' },
  { q: 'Will the crop reduce image quality?', a: 'No, cropping only changes the dimensions — no re-encoding or quality loss.' },
  { q: 'Is this free?', a: 'Yes, completely free.' },
];

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPt, setStartPt] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function onFiles(files: File[]) {
    const f = files[0] ?? null;
    setFile(f);
    setOutputUrl(null);
    setCropRect({ x: 0, y: 0, w: 0, h: 0 });
    if (f) setImgSrc(URL.createObjectURL(f));
    else setImgSrc(null);
  }

  function getRelPos(e: React.MouseEvent) {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onMouseDown(e: React.MouseEvent) {
    const pos = getRelPos(e);
    setStartPt(pos);
    setCropRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
    setDragging(true);
  }

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const pos = getRelPos(e);
    let w = pos.x - startPt.x;
    let h = pos.y - startPt.y;
    if (ratio) h = w / ratio;
    setCropRect({ x: startPt.x, y: startPt.y, w, h });
  }, [dragging, startPt, ratio]);

  function onMouseUp() { setDragging(false); }

  function crop() {
    if (!file || !imgRef.current || !cropRect.w || !cropRect.h) return;
    setProcessing(true);
    trackToolUsage('image-cropper');
    const img = imgRef.current;
    const container = containerRef.current!;
    const scaleX = img.naturalWidth / container.clientWidth;
    const scaleY = img.naturalHeight / container.clientHeight;
    const canvas = document.createElement('canvas');
    const cx = cropRect.w > 0 ? cropRect.x : cropRect.x + cropRect.w;
    const cy = cropRect.h > 0 ? cropRect.y : cropRect.y + cropRect.h;
    canvas.width = Math.abs(cropRect.w) * scaleX;
    canvas.height = Math.abs(cropRect.h) * scaleY;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, cx * scaleX, cy * scaleY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) setOutputUrl(URL.createObjectURL(blob));
      setProcessing(false);
    }, 'image/jpeg', 0.95);
  }

  const hasCrop = Math.abs(cropRect.w) > 5 && Math.abs(cropRect.h) > 5;

  return (
    <>
      <SEOHead
        title="Free Image Cropper Online – Crop PNG JPG WEBP | OnlineFileTool.com"
        description="Crop images online for free with aspect ratio options. Draw to select crop area. Browser-based, instant, no upload."
        canonical="https://onlinefiletool.com/image-cropper"
      />
      <ToolPageWrapper
        title="Free Image Cropper Online"
        description="Draw a crop area on your image and download the result instantly. Choose from preset aspect ratios or crop freely."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Image Tools' }, { label: 'Image Cropper' }]}
        faqs={faqs}
      >
        <DropZone accept="image/*" onFiles={onFiles} label="Drop an image to crop" hint="Supports PNG, JPG, WEBP" />
        {imgSrc && (
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Aspect Ratio</p>
              <div className="flex flex-wrap gap-2">
                {ratios.map((r) => (
                  <button key={r.label} onClick={() => setRatio(r.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      ratio === r.value ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-700 border-gray-300 hover:border-sky-300'
                    }`}
                  >{r.label}</button>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">Draw on the image to select the crop area:</p>
            <div ref={containerRef}
              className="relative rounded-xl overflow-hidden border border-gray-200 cursor-crosshair select-none"
              onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            >
              <img ref={imgRef} src={imgSrc} alt="Crop source" className="w-full block pointer-events-none" draggable={false} />
              {hasCrop && (
                <div className="absolute border-2 border-sky-400 bg-sky-400/10 pointer-events-none"
                  style={{
                    left: Math.min(cropRect.x, cropRect.x + cropRect.w),
                    top: Math.min(cropRect.y, cropRect.y + cropRect.h),
                    width: Math.abs(cropRect.w),
                    height: Math.abs(cropRect.h),
                  }}
                />
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={crop} disabled={processing || !hasCrop}
                className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <Crop className="w-4 h-4" /> {processing ? 'Cropping...' : 'Crop Image'}
              </button>
              {outputUrl && (
                <a href={outputUrl} download="cropped.jpg" onClick={() => trackDownload('image-cropper')}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              )}
            </div>
          </div>
        )}
      </ToolPageWrapper>
    </>
  );
}
