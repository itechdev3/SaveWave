import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, RefreshCw } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import DropZone from '../../components/DropZone';
import { trackToolUsage, trackDownload } from '../../lib/analytics';

const faqs = [
  { q: 'Which image formats can be converted to PDF?', a: 'JPG, PNG, and WEBP images can be converted to PDF directly in your browser.' },
  { q: 'Can I convert multiple images to one PDF?', a: 'Yes — upload multiple images and they will all be combined into a single PDF, one image per page.' },
  { q: 'Can I convert PDF to images?', a: 'PDF to image extraction requires browser PDF rendering. Use the PDF viewer and screenshot method for now.' },
  { q: 'Is this free?', a: 'Completely free with no limits.' },
];

export default function PdfConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onFiles(incoming: File[]) { setFiles(incoming); setOutputUrl(null); setError(null); }

  async function convert() {
    if (!files.length) return;
    setProcessing(true);
    setError(null);
    trackToolUsage('pdf-converter');
    try {
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        let img;
        if (file.type === 'image/jpeg') {
          img = await pdf.embedJpg(bytes);
        } else if (file.type === 'image/png') {
          img = await pdf.embedPng(bytes);
        } else {
          const blob = await canvasConvert(file);
          const pngBytes = await blob.arrayBuffer();
          img = await pdf.embedPng(pngBytes);
        }
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setOutputUrl(URL.createObjectURL(blob));
    } catch {
      setError('Failed to create PDF. Please try again with valid image files.');
    } finally {
      setProcessing(false);
    }
  }

  function canvasConvert(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Canvas error')), 'image/png');
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  return (
    <>
      <SEOHead
        title="Free PDF Converter Online – Image to PDF Tool | OnlineFileTool.com"
        description="Convert images to PDF online for free. JPG, PNG, WEBP to PDF in your browser. Combine multiple images into one PDF. No upload."
        canonical="https://onlinefiletool.com/pdf-converter"
      />
      <ToolPageWrapper
        title="Free Image to PDF Converter"
        description="Convert JPG, PNG or WEBP images to PDF format. Upload multiple images to combine them into a single PDF document."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'PDF Tools' }, { label: 'PDF Converter' }]}
        faqs={faqs}
      >
        <DropZone accept="image/*" multiple onFiles={onFiles} label="Drop images here to convert to PDF" hint="JPG, PNG, WEBP — multiple files supported" />
        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="bg-orange-50 rounded-xl p-3 text-sm text-orange-800">
              {files.length} image{files.length > 1 ? 's' : ''} will be combined into 1 PDF ({files.length} page{files.length > 1 ? 's' : ''})
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
            <button onClick={convert} disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              {processing ? 'Creating PDF...' : 'Convert to PDF'}
            </button>
            {outputUrl && (
              <a href={outputUrl} download="converted.pdf" onClick={() => trackDownload('pdf-converter')}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
            )}
          </div>
        )}
      </ToolPageWrapper>
    </>
  );
}
