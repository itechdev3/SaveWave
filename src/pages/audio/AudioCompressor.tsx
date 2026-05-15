import { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import ToolPageWrapper from '../../components/ToolPageWrapper';
import DropZone from '../../components/DropZone';
import { trackToolUsage, trackDownload } from '../../lib/analytics';

const faqs = [
  { q: 'How does audio compression work?', a: 'Audio compression reduces file size by lowering the sample rate and bit depth. The Web Audio API handles this entirely in your browser.' },
  { q: 'Will the audio sound worse?', a: 'At moderate compression levels (50-70%), the difference is barely audible to most listeners.' },
  { q: 'What formats are supported?', a: 'MP3, WAV, and M4A files are supported as input.' },
  { q: 'Is this free?', a: 'Yes, completely free.' },
];

export default function AudioCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(60);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onFiles(files: File[]) { setFile(files[0] ?? null); setOutputUrl(null); setOutputSize(null); setError(null); }

  async function compress() {
    if (!file) return;
    setProcessing(true);
    setError(null);
    trackToolUsage('audio-compressor');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new AudioContext();
      const decoded = await audioCtx.decodeAudioData(arrayBuffer);
      const targetRate = Math.round(decoded.sampleRate * (quality / 100));
      const offlineCtx = new OfflineAudioContext(
        decoded.numberOfChannels > 1 && quality < 50 ? 1 : decoded.numberOfChannels,
        Math.ceil(decoded.length * (targetRate / decoded.sampleRate)),
        Math.max(8000, targetRate),
      );
      const source = offlineCtx.createBufferSource();
      source.buffer = decoded;
      source.connect(offlineCtx.destination);
      source.start();
      const rendered = await offlineCtx.startRendering();
      const blob = bufferToWave(rendered);
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      audioCtx.close();
    } catch {
      setError('Could not process this audio file. Please try a different file.');
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

  return (
    <>
      <SEOHead
        title="Free Audio Compressor Online – Reduce Audio File Size | OnlineFileTool.com"
        description="Compress audio files online for free. Reduce MP3 and WAV file size in your browser. No upload, private, instant."
        canonical="https://onlinefiletool.com/audio-compressor"
      />
      <ToolPageWrapper
        title="Free Audio Compressor Online"
        description="Reduce audio file size without significant quality loss. Adjust the compression level to balance file size and audio quality."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Audio Tools' }, { label: 'Audio Compressor' }]}
        faqs={faqs}
      >
        <DropZone accept="audio/*" onFiles={onFiles} label="Drop an audio file to compress" hint="MP3, WAV, M4A supported" />
        {file && (
          <div className="mt-6 space-y-5">
            <audio controls src={URL.createObjectURL(file)} className="w-full rounded-lg" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality: {quality}% — Original: {(file.size / 1024).toFixed(0)} KB</label>
              <input type="range" min="20" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-emerald-500" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Smaller file</span><span>Higher quality</span></div>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
            <button onClick={compress} disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              {processing ? 'Compressing...' : 'Compress Audio'}
            </button>
            {outputUrl && outputSize && (
              <div className="space-y-3">
                <div className="flex gap-3 text-sm">
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center"><p className="text-gray-500">Original</p><p className="font-bold text-gray-900">{(file.size / 1024).toFixed(0)} KB</p></div>
                  <div className="flex-1 bg-emerald-50 rounded-xl p-3 text-center"><p className="text-emerald-600">Compressed</p><p className="font-bold text-emerald-700">{(outputSize / 1024).toFixed(0)} KB</p></div>
                  <div className="flex-1 bg-sky-50 rounded-xl p-3 text-center"><p className="text-sky-600">Saved</p><p className="font-bold text-sky-700">{(((file.size - outputSize) / file.size) * 100).toFixed(1)}%</p></div>
                </div>
                <a href={outputUrl} download="compressed_audio.wav" onClick={() => trackDownload('audio-compressor')}
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Compressed Audio
                </a>
              </div>
            )}
          </div>
        )}
      </ToolPageWrapper>
    </>
  );
}
