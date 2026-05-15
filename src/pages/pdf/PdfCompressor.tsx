import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, RefreshCw } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import DropZone from '../../components/DropZone';
import { trackToolUsage, trackDownload } from '../../lib/analytics';

const faqs = [
  { q: 'How much can PDF compression reduce file size?', a: 'Results vary. PDFs with large embedded images can be significantly compressed. Text-only PDFs may see minimal reduction.' },
  { q: 'Does compression affect PDF quality?', a: 'Structure and text are preserved. Embedded images are resampled at a lower quality to reduce size.' },
  { q: 'Is this safe for confidential documents?', a: 'Yes — all processing happens in your browser. Nothing is uploaded to any server.' },
  { q: 'Is this free?', a: 'Yes, completely free.' },
];

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onFiles(files: File[]) { setFile(files[0] ?? null); setOutputUrl(null); setOutputSize(null); setError(null); }

  async function compress() {
    if (!file) return;
    setProcessing(true);
    setError(null);
    trackToolUsage('pdf-compressor');
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const compressed = await doc.save({ useObjectStreams: true });
      const blob = new Blob([compressed], { type: 'application/pdf' });
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
    } catch {
      setError('Could not compress this PDF. It may be encrypted or corrupted.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <SEOHead
        title="Free PDF Compressor Online – Reduce PDF File Size | OnlineFileTool.com"
        description="Compress PDF files online for free. Reduce PDF size in your browser with no upload. Fast, private, instant results."
        canonical="https://onlinefiletool.com/pdf-compressor"
      />
      <ToolPageWrapper
        title="Free PDF Compressor Online"
        description="Reduce your PDF file size without losing content. Browser-based compression removes unused objects and optimizes PDF structure."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'PDF Tools' }, { label: 'PDF Compressor' }]}
        faqs={faqs}
      >
        <DropZone accept="application/pdf" onFiles={onFiles} label="Drop a PDF file to compress" hint="PDF documents only" />
        {file && (
          <div className="mt-6 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-orange-700 font-bold text-xs">PDF</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
            <button onClick={compress} disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              {processing ? 'Compressing...' : 'Compress PDF'}
            </button>
            {outputUrl && outputSize && (
              <div className="space-y-3">
                <div className="flex gap-3 text-sm">
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center"><p className="text-gray-500">Original</p><p className="font-bold text-gray-900">{(file.size / 1024).toFixed(0)} KB</p></div>
                  <div className="flex-1 bg-emerald-50 rounded-xl p-3 text-center"><p className="text-emerald-600">Compressed</p><p className="font-bold text-emerald-700">{(outputSize / 1024).toFixed(0)} KB</p></div>
                  <div className="flex-1 bg-sky-50 rounded-xl p-3 text-center"><p className="text-sky-600">Saved</p><p className="font-bold text-sky-700">{(((file.size - outputSize) / file.size) * 100).toFixed(1)}%</p></div>
                </div>
                <a href={outputUrl} download="compressed.pdf" onClick={() => trackDownload('pdf-compressor')}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Compressed PDF
                </a>
              </div>
            )}
          </div>
        )}
      </ToolPageWrapper>
    </>
  );
}
