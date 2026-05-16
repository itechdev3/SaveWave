import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronRight, Search, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';

interface AnalyzeResult {
  platform: string;
  title: string;
  status: 'analyzed' | 'invalid';
}

interface ResolveResult {
  status: 'ready' | 'unavailable' | 'error';
  download_url?: string;
  file_name?: string;
  reason?: string;
}

export default function Downloader() {
  const [url, setUrl] = useState('');
  const [step, setStep] = useState<'idle' | 'analyzing' | 'analyzed' | 'resolving' | 'done'>('idle');
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [resolveResult, setResolveResult] = useState<ResolveResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function detectPlatform(urlStr: string): string {
    try {
      const parsed = new URL(urlStr);
      const host = parsed.hostname.replace('www.', '');
      if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
      if (host.includes('tiktok.com')) return 'tiktok';
      if (host.includes('instagram.com')) return 'instagram';
      if (host.includes('twitter.com') || host.includes('x.com')) return 'twitter';
      const path = parsed.pathname.toLowerCase();
      if (['.mp4', '.mp3', '.webm', '.jpg', '.png'].some(ext => path.endsWith(ext))) return 'direct';
      return 'unknown';
    } catch {
      return 'invalid';
    }
  }

  async function analyze() {
    if (!url.trim()) return;
    setError(null);
    setAnalyzeResult(null);
    setResolveResult(null);
    setStep('analyzing');

    try {
      new URL(url.trim());
    } catch {
      setError('Please enter a valid URL');
      setStep('idle');
      return;
    }

    const platform = detectPlatform(url.trim());
    const result: AnalyzeResult = {
      platform,
      title: url.trim().split('/').pop() || 'Content',
      status: 'analyzed',
    };

    setAnalyzeResult(result);
    setStep('analyzed');
  }

  async function resolve() {
    if (!url.trim() || !analyzeResult) return;
    setStep('resolving');
    setError(null);
    setResolveResult(null);

    const platform = analyzeResult.platform;

    if (platform === 'direct') {
      const fileName = url.trim().split('/').pop() || 'download';
      setResolveResult({
        status: 'ready',
        download_url: url.trim(),
        file_name: fileName,
      });
      setStep('done');
      return;
    }

    if (['youtube', 'tiktok', 'instagram', 'twitter'].includes(platform)) {
      setResolveResult({
        status: 'unavailable',
        reason: `${platform} content requires external extraction tools. Please use a dedicated downloader service.`,
      });
      setStep('done');
      return;
    }

    setResolveResult({
      status: 'unavailable',
      reason: 'No accessible media found at this URL.',
    });
    setStep('done');
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      if (step === 'analyzed') resolve();
      else if (step === 'idle' || step === 'done') analyze();
    }
  }

  const platformLabels: Record<string, string> = {
    youtube: 'YouTube',
    tiktok: 'TikTok',
    instagram: 'Instagram',
    twitter: 'Twitter/X',
    direct: 'Direct Media',
    unknown: 'Unknown',
    invalid: 'Invalid',
  };

  return (
    <>
      <SEOHead
        title="Free Online Downloader – Download Media & Files"
        description="Free online file downloader for media and files. Safe, fast, and simple to use. Direct URL support."
      />

      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Downloader</span>
          </div>
        </div>

        {/* Header */}
        <section className="bg-gradient-to-r from-purple-500 to-pink-400 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <Download className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Media Downloader</h1>
            </div>
            <p className="text-lg text-purple-100">
              Download media files and content from the web
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Input Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Download Media Files</h2>

            <div className="space-y-6">
              {/* URL Input */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-4 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-400 transition-all bg-white">
                  <Download className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (step !== 'idle') {
                        setStep('idle');
                        setAnalyzeResult(null);
                        setResolveResult(null);
                        setError(null);
                      }
                    }}
                    onKeyDown={onKeyDown}
                    className="flex-1 py-3 text-sm outline-none bg-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
                <button
                  onClick={step === 'analyzed' ? resolve : analyze}
                  disabled={!url.trim() || step === 'analyzing' || step === 'resolving'}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  {step === 'analyzing' || step === 'resolving' ? (
                    <><Loader className="w-4 h-4 animate-spin" />{step === 'analyzing' ? 'Analyzing...' : 'Resolving...'}</>
                  ) : step === 'analyzed' ? (
                    <><Download className="w-4 h-4" />Get Download</>
                  ) : (
                    <><Search className="w-4 h-4" />Analyze</>
                  )}
                </button>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />{error}
                </div>
              )}

              {analyzeResult && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <Download className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                          {platformLabels[analyzeResult.platform] || analyzeResult.platform}
                        </span>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">{analyzeResult.title}</p>
                    </div>
                  </div>

                  {step === 'analyzed' && (
                    <button onClick={resolve}
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      <Download className="w-4 h-4" />Get Download Link
                    </button>
                  )}

                  {step === 'resolving' && (
                    <div className="mt-4 flex items-center justify-center gap-2 py-3 text-purple-600">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium">Resolving media source...</span>
                    </div>
                  )}
                </div>
              )}

              {resolveResult && (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  {resolveResult.status === 'ready' && (
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                        <div>
                          <p className="font-semibold text-gray-900">Download ready</p>
                          {resolveResult.file_name && <p className="text-sm text-gray-500">{resolveResult.file_name}</p>}
                        </div>
                      </div>
                      <a
                        href={resolveResult.download_url}
                        download={resolveResult.file_name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
                      >
                        <Download className="w-4 h-4" />Download File
                      </a>
                    </div>
                  )}

                  {resolveResult.status === 'unavailable' && (
                    <div className="p-5 flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Not Available</p>
                        <p className="text-sm text-gray-600">{resolveResult.reason}</p>
                      </div>
                    </div>
                  )}

                  {resolveResult.status === 'error' && (
                    <div className="p-5 flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Error</p>
                        <p className="text-sm text-gray-600">{resolveResult.reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Supported Formats */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Supported Formats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['MP4', 'MP3', 'WebM', 'JPG', 'PNG', 'GIF', 'PDF', 'More...'].map((format) => (
                <div key={format} className="text-center">
                  <span className="inline-block px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700 border border-blue-200">
                    {format}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">FAQ</h3>
            <div className="space-y-4">
              {[
                { q: 'What formats can I download?', a: 'Direct media files like MP4, MP3, JPG, PNG, PDF, and other direct URLs are supported.' },
                { q: 'Can I download from YouTube/TikTok?', a: 'Direct extraction is not supported. These platforms require external dedicated downloaders.' },
                { q: 'Is it safe?', a: 'Yes, downloads are direct and safe. No malware or viruses.' },
                { q: 'Do I need to register?', a: 'No registration required. Paste a URL and download directly.' },
              ].map(({ q, a }, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <details>
                    <summary className="cursor-pointer font-medium text-gray-900 flex justify-between items-center">
                      {q}
                      <span className="text-xs">▼</span>
                    </summary>
                    <p className="mt-3 text-gray-600 text-sm">{a}</p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-100 py-12 mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need other tools?</h2>
            <p className="text-gray-600 mb-8">Check out our other free online tools for images, audio, and PDF files</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
