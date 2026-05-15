import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, RefreshCw, GripVertical, Trash2 } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import DropZone from '../../components/DropZone';
import { trackToolUsage, trackDownload } from '../../lib/analytics';

const faqs = [
  { q: 'How many PDFs can I merge?', a: 'You can merge as many PDF files as you need in a single operation.' },
  { q: 'Does the order matter?', a: 'Yes — PDFs are merged in the order they are listed. You can remove and re-add files to reorder.' },
  { q: 'Are my files safe?', a: 'Merging happens entirely in your browser using PDF-lib. No files are sent to any server.' },
  { q: 'Is this free?', a: 'Yes, completely free.' },
];

export default function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onFiles(incoming: File[]) {
    setFiles((prev) => [...prev, ...incoming]);
    setOutputUrl(null);
    setError(null);
  }

  function remove(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setOutputUrl(null);
  }

  async function merge() {
    if (files.length < 2) return;
    setProcessing(true);
    setError(null);
    trackToolUsage('pdf-merge');
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setOutputUrl(URL.createObjectURL(blob));
    } catch {
      setError('Failed to merge PDFs. Make sure all files are valid PDF documents.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <SEOHead
        title="Free PDF Merge Tool Online – Combine PDFs | OnlineFileTool.com"
        description="Merge multiple PDF files into one online for free. Browser-based PDF merger, no upload, no account needed. Instant results."
        canonical="https://onlinefiletool.com/pdf-merge"
      />
      <ToolPageWrapper
        title="Free PDF Merge Tool Online"
        description="Combine multiple PDF files into a single document. Upload your PDFs, review the order, and download the merged result."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'PDF Tools' }, { label: 'PDF Merge' }]}
        faqs={faqs}
      >
        <DropZone accept="application/pdf" multiple onFiles={onFiles} label="Drop PDF files to merge" hint="Add all PDFs you want to combine" />
        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Files to merge ({files.length})</p>
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 text-orange-700 text-xs font-bold">{i + 1}</div>
                  <span className="flex-1 text-sm text-gray-800 truncate">{file.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                  <button onClick={() => remove(i)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {files.length < 2 && (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">Add at least 2 PDF files to merge.</p>
            )}
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
            <button onClick={merge} disabled={processing || files.length < 2}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              {processing ? 'Merging...' : `Merge ${files.length} PDFs`}
            </button>
            {outputUrl && (
              <a href={outputUrl} download="merged.pdf" onClick={() => trackDownload('pdf-merge')}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Download Merged PDF
              </a>
            )}
          </div>
        )}
      </ToolPageWrapper>
    </>
  );
}
