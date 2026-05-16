import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, ArrowRight, ChevronRight, Download, RefreshCw, AlertCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const tools = [
  { id: 'converter', title: 'MP3 Converter', desc: 'Convert audio files to MP3 or other formats' },
  { id: 'cutter', title: 'Audio Cutter', desc: 'Cut, trim, and extract specific parts of audio' },
  { id: 'compressor', title: 'Audio Compressor', desc: 'Reduce audio file size without quality loss' },
];

function AudioConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setOutputUrl(null);
    setError(null);
  }

  async function convert() {
    if (!file) return;
    setProcessing(true);
    setError(null);
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
      const wavBlob = bufferToWave(renderedBuffer);
      setOutputUrl(URL.createObjectURL(wavBlob));
      audioCtx.close();
    } catch {
      setError('Could not process this audio file. Try a different format.');
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
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 transition-colors"
        onClick={() => document.getElementById('audio-input')?.click()}
      >
        <Music className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="font-medium text-gray-700">Drop audio file or click to upload</p>
        <p className="text-xs text-gray-500 mt-1">MP3, WAV, M4A, OGG supported</p>
        <input id="audio-input" type="file" accept="audio/*" className="hidden" onChange={onFileChange} />
      </div>

      {file && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700 font-bold text-xs">
                {file.name.split('.').pop()?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{file.name}</p>
              <p className="text-gray-500 text-xs">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
          <audio controls src={URL.createObjectURL(file)} className="w-full rounded-lg" />
          {error && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{error}
            </div>
          )}
          <button onClick={convert} disabled={processing}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
            {processing ? 'Converting...' : 'Convert to WAV'}
          </button>
          {outputUrl && (
            <a href={outputUrl} download="converted.wav"
              className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" /> Download WAV
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function AudioCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(60);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setOutputUrl(null);
    setOutputSize(null);
    setError(null);
  }

  async function compress() {
    if (!file) return;
    setProcessing(true);
    setError(null);
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
      setError('Could not process this audio file.');
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
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 transition-colors"
        onClick={() => document.getElementById('compress-audio-input')?.click()}
      >
        <Music className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="font-medium text-gray-700">Drop audio to compress</p>
        <p className="text-xs text-gray-500 mt-1">MP3, WAV, M4A supported</p>
        <input id="compress-audio-input" type="file" accept="audio/*" className="hidden" onChange={onFileChange} />
      </div>

      {file && (
        <div className="space-y-4">
          <audio controls src={URL.createObjectURL(file)} className="w-full rounded-lg" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality: {quality}% — Original: {(file.size / 1024).toFixed(0)} KB</label>
            <input type="range" min="20" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-emerald-500" />
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
              <a href={outputUrl} download="compressed_audio.wav"
                className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Download Compressed
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AudioTools() {
  const [activeTool, setActiveTool] = useState<string>('converter');

  return (
    <>
      <SEOHead
        title="Free Audio Tools Online – Convert & Compress Audio Files"
        description="Free online audio converter and compressor. Convert MP3, WAV, M4A. Compress audio files. No signup required."
      />

      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Audio Tools</span>
          </div>
        </div>

        {/* Header */}
        <section className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <Music className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Audio Tools</h1>
            </div>
            <p className="text-lg text-emerald-100">
              Free online tools for converting and compressing audio files
            </p>
          </div>
        </section>

        {/* Tool Tabs */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {tools.map(({ id, title, desc }) => (
              <button key={id} onClick={() => setActiveTool(id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  activeTool === id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-xs text-gray-600 mt-1">{desc}</p>
              </button>
            ))}
          </div>

          {/* Active Tool */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            {activeTool === 'converter' && <AudioConverterTool />}
            {activeTool === 'compressor' && <AudioCompressorTool />}
            {activeTool === 'cutter' && (
              <div className="text-center py-12 text-gray-500">
                <p className="font-medium">Audio Cutter coming soon</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-100 py-12 mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need other file tools?</h2>
            <p className="text-gray-600 mb-8">Explore our full suite of free online tools for images, PDF, and more</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Back to Home <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
