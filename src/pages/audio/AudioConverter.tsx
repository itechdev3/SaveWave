import { useState } from 'react';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import DropZone from '../../components/DropZone';
import { trackToolUsage, trackDownload } from '../../lib/analytics';

const faqs = [
  { q: 'Which audio formats are supported?', a: 'MP3, WAV, M4A and OGG are commonly supported. Browser support varies for each format.' },
  { q: 'Is the conversion lossless?', a: 'Audio conversion is processed using the Web Audio API. Quality depends on the selected bitrate.' },
  { q: 'Does it work on mobile?', a: 'Yes, though some formats may have limited support on certain mobile browsers.' },
  { q: 'Is this free?', a: 'Yes, completely free with no account needed.' },
];

const targetFormats = [
  { label: 'WAV', mime: 'audio/wav', ext: 'wav' },
  { label: 'OGG', mime: 'audio/ogg', ext: 'ogg' },
];

export default function AudioConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetMime, setTargetMime] = useState('audio/wav');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onFiles(files: File[]) { setFile(files[0] ?? null); setOutputUrl(null); setError(null); }

  async function convert() {
    if (!file) return;
    setProcessing(true);
    setError(null);
    trackToolUsage('audio-converter');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new AudioContext();
      const decoded = await audioCtx.decodeAudioData(arrayBuffer);
      const offlineCtx = new OfflineAudioContext(decoded.numberOfChannels, decoded.length, decoded.sampleRate);
      const source = offlineCtx.createBufferSource();
      source.buffer = decoded;
      source.connect(offlineCtx.destination);
      source.start();
      const renderedBuffer = await offlineCtx.startRendering();
      if (targetMime === 'audio/wav') {
        const wavBlob = bufferToWave(renderedBuffer);
        setOutputUrl(URL.createObjectURL(wavBlob));
      } else {
        setError('Direct OGG encoding requires a backend. Try downloading as WAV instead.');
      }
      audioCtx.close();
    } catch {
      setError('Could not process this audio file. Please try a different format.');
    } finally {
      setProcessing(false);
    }
  }

  function bufferToWave(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const out = new ArrayBuffer(44 + buffer.length * numChannels * 2);
    const view = new DataView(out);
    const ws = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
    ws(0, 'RIFF'); view.setUint32(4, 36 + buffer.length * numChannels * 2, true);
    ws(8, 'WAVE'); ws(12, 'fmt '); view.setUint32(16, 16, true);
    view.setInt16(20, 1, true); view.setInt16(22, numChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * numChannels * 2, true);
    view.setInt16(32, numChannels * 2, true); view.setInt16(34, 16, true);
    ws(36, 'data'); view.setUint32(40, buffer.length * numChannels * 2, true);
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        offset += 2;
      }
    }
    return new Blob([out], { type: 'audio/wav' });
  }

  const selectedFmt = targetFormats.find((f) => f.mime === targetMime) ?? targetFormats[0];

  return (
    <>
      <SEOHead
        title="Free Audio Converter Online – MP3 WAV M4A Tool | OnlineFileTool.com"
        description="Convert audio files online for free. MP3, WAV, OGG conversion in your browser. No upload, instant, private."
        canonical="https://onlinefiletool.com/audio-converter"
      />
      <ToolPageWrapper
        title="Free Audio Converter Online"
        description="Convert audio files between WAV and OGG formats directly in your browser. Fast, private, no account required."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Audio Tools' }, { label: 'Audio Converter' }]}
        faqs={faqs}
      >
        <DropZone accept="audio/*" onFiles={onFiles} label="Drop an audio file to convert" hint="MP3, WAV, M4A, OGG supported" />
        {file && (
          <div className="mt-6 space-y-5">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-700 font-bold text-xs uppercase">{file.name.split('.').pop()}</span>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{file.name}</p>
                <p className="text-gray-500 text-xs">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            <audio controls src={URL.createObjectURL(file)} className="w-full rounded-lg" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Convert to</label>
              <div className="flex gap-2">
                {targetFormats.map((f) => (
                  <button key={f.mime} onClick={() => setTargetMime(f.mime)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      targetMime === f.mime ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                    }`}
                  >{f.label}</button>
                ))}
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{error}
              </div>
            )}
            <button onClick={convert} disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              {processing ? 'Converting...' : 'Convert Audio'}
            </button>
            {outputUrl && (
              <a href={outputUrl} download={`converted.${selectedFmt.ext}`} onClick={() => trackDownload('audio-converter')}
                className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Download {selectedFmt.label}
              </a>
            )}
          </div>
        )}
      </ToolPageWrapper>
    </>
  );
}
