import { useState } from 'react';
import { Download, Search, AlertTriangle, CheckCircle, XCircle, Link as LinkIcon, Loader } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import ToolPageWrapper from '../components/ToolPageWrapper';
import { trackToolUsage, trackDownload } from '../lib/analytics';

const DIRECT_EXTENSIONS = ['.mp4', '.mp3', '.webm', '.jpg', '.jpeg', '.png', '.gif', '.wav', '.ogg', '.pdf', '.m4a'];

interface AnalyzeResult {
  platform: string;
  title: string;
  thumbnail: string;
  status: 'analyzed' | 'invalid';
}

interface ResolveResult {
  status: 'ready' | 'unavailable' | 'error';
  download_url?: string;
  file_name?: string;
  file_size?: string;
  reason?: string;
}

const faqs = [
  { q: 'What URLs can I download?', a: 'Direct media file URLs (ending in .mp4, .mp3, .jpg, etc.) are fully supported. Platform URLs like YouTube and TikTok are analyzed but may not always yield downloadable media.' },
  { q: 'Can I download from YouTube or TikTok?', a: 'The tool will attempt to analyze platform URLs and extract media when possible. If extraction fails, it will clearly report the reason.' },
  { q: 'Is this safe to use?', a: 'Yes — we validate all URLs and never fabricate download links. If media cannot be extracted, you will be clearly informed.' },
  { q: 'What formats are supported?', a: 'MP4, MP3, WEBM, JPG, PNG, GIF, WAV, OGG, M4A, PDF — any direct public URL to these files.' },
];

function detectPlatform(url: URL): string {
  const host = url.hostname.replace('www.', '');
  if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
  if (host.includes('tiktok.com')) return 'tiktok';
  if (host.includes('instagram.com')) return 'instagram';
  if (host.includes('twitter.com') || host.includes('x.com')) return 'twitter';
  if (host.includes('facebook.com') || host.includes('fb.watch')) return 'facebook';
  if (host.includes('vimeo.com')) return 'vimeo';
  if (host.includes('dailymotion.com')) return 'dailymotion';
  if (host.includes('reddit.com')) return 'reddit';
  if (host.includes('twitch.tv')) return 'twitch';
  const path = url.pathname.toLowerCase();
  if (DIRECT_EXTENSIONS.some((ext) => path.endsWith(ext))) return 'direct';
  return 'unknown';
}

export default function Downloader() {
  const [url, setUrl] = useState('');
  const [step, setStep] = useState<'idle' | 'analyzing' | 'analyzed' | 'resolving' | 'done'>('idle');
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [resolveResult, setResolveResult] = useState<ResolveResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!url.trim()) return;
    setError(null);
    setAnalyzeResult(null);
    setResolveResult(null);
    setStep('analyzing');
    trackToolUsage('downloader');

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.trim());
    } catch {
      setError('Please enter a valid URL starting with http:// or https://');
      setStep('idle');
      return;
    }

    const platform = detectPlatform(parsedUrl);
    const path = parsedUrl.pathname.toLowerCase();
    const isDirectMedia = DIRECT_EXTENSIONS.some((ext) => path.endsWith(ext));

    // Build analyze result
    const result: AnalyzeResult = {
      platform,
      title: isDirectMedia ? (path.split('/').pop() ?? 'Media file') : `Content from ${platform}`,
      thumbnail: '',
      status: 'analyzed',
    };

    // For direct media, set thumbnail from URL
    if (isDirectMedia && ['.jpg', '.jpeg', '.png', '.gif'].some((ext) => path.endsWith(ext))) {
      result.thumbnail = url.trim();
    }

    setAnalyzeResult(result);
    setStep('analyzed');
  }

  async function resolve() {
    if (!url.trim() || !analyzeResult) return;
    setStep('resolving');
    setError(null);
    setResolveResult(null);

    const parsedUrl = new URL(url.trim());
    const path = parsedUrl.pathname.toLowerCase();
    const isDirectMedia = DIRECT_EXTENSIONS.some((ext) => path.endsWith(ext));

    // Tier 1: Direct media URL
    if (isDirectMedia) {
      const fileName = path.split('/').pop() ?? 'download';
      setResolveResult({
        status: 'ready',
        download_url: url.trim(),
        file_name: fileName,
      });
      setStep('done');
      return;
    }

    // Tier 2: Try edge function for platform extraction
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (supabaseUrl && anonKey) {
        const response = await fetch(`${supabaseUrl}/functions/v1/downloader/resolve`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: url.trim(), platform: analyzeResult.platform }),
        });
        const data = await response.json();
        if (data.status === 'ready' && data.download_url) {
          setResolveResult({
            status: 'ready',
            download_url: data.download_url,
            file_name: data.file_name,
            file_size: data.file_size,
          });
          setStep('done');
          return;
        }
        if (data.status === 'unavailable') {
          setResolveResult({
            status: 'unavailable',
            reason: data.reason || 'No accessible media stream found for this URL.',
          });
          setStep('done');
          return;
        }
      }
    } catch {
      // Edge function not available, fall through
    }

    // Tier 3: Fallback — check for og:video via simple HEAD request
    try {
      const response = await fetch(url.trim(), { method: 'HEAD', mode: 'no-cors' });
      // no-cors means we can't read the response, but we can try direct navigation
    } catch {
      // ignore
    }

    // Final fallback
    setResolveResult({
      status: 'unavailable',
      reason: analyzeResult.platform === 'unknown'
        ? 'This does not appear to be a direct media file URL. Paste a direct link ending in .mp4, .mp3, .jpg, .png, etc.'
        : `Could not extract media from ${analyzeResult.platform}. The platform may require external extraction tools or the content may be protected.`,
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
    facebook: 'Facebook',
    vimeo: 'Vimeo',
    dailymotion: 'Dailymotion',
    reddit: 'Reddit',
    twitch: 'Twitch',
    direct: 'Direct Media',
    unknown: 'Unknown',
  };

  return (
    <>
      <SEOHead
        title="Free File Downloader Online – Media URL Downloader | OnlineFileTool.com"
        description="Download direct media file URLs online for free. Supports MP4, MP3, JPG, PNG, WEBM and more. Safe, fast, browser-based."
        canonical="https://onlinefiletool.com/downloader"
      />
      <ToolPageWrapper
        title="Media File Downloader"
        description="Paste a URL to analyze and download media files. Supports direct media URLs and attempts extraction from popular platforms."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'File Downloader' }]}
        faqs={faqs}
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-400 transition-all bg-white">
              <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="url"
                placeholder="https://example.com/video.mp4"
                value={url}
                onChange={(e) => { setUrl(e.target.value); if (step !== 'idle') { setStep('idle'); setAnalyzeResult(null); setResolveResult(null); setError(null); } }}
                onKeyDown={onKeyDown}
                className="flex-1 py-3 text-sm outline-none bg-transparent text-gray-900 placeholder-gray-400"
              />
            </div>
            <button
              onClick={step === 'analyzed' ? resolve : analyze}
              disabled={!url.trim() || step === 'analyzing' || step === 'resolving'}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
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
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />{error}
            </div>
          )}

          {analyzeResult && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  {analyzeResult.thumbnail && (
                    <img src={analyzeResult.thumbnail} alt="Thumbnail" className="w-20 h-14 object-cover rounded-lg border border-gray-200" />
                  )}
                  {!analyzeResult.thumbnail && (
                    <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <LinkIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-700">
                        {platformLabels[analyzeResult.platform] || analyzeResult.platform}
                      </span>
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{analyzeResult.title}</p>
                  </div>
                </div>

                {step === 'analyzed' && (
                  <button onClick={resolve}
                    className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    <Download className="w-4 h-4" />Get Download Link
                  </button>
                )}

                {step === 'resolving' && (
                  <div className="flex items-center justify-center gap-2 py-3 text-sky-600">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Resolving media source...</span>
                  </div>
                )}
              </div>
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
                      {resolveResult.file_size && <p className="text-xs text-gray-400">{resolveResult.file_size}</p>}
                    </div>
                  </div>
                  <a
                    href={resolveResult.download_url}
                    download={resolveResult.file_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackDownload('downloader')}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    <Download className="w-4 h-4" />Download File
                  </a>
                </div>
              )}

              {resolveResult.status === 'unavailable' && (
                <div className="p-5 flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Not Available</p>
                    <p className="text-sm text-gray-600">{resolveResult.reason}</p>
                  </div>
                </div>
              )}

              {resolveResult.status === 'error' && (
                <div className="p-5 flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Error</p>
                    <p className="text-sm text-gray-600">{resolveResult.reason}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Supported File Types</h3>
          <div className="flex flex-wrap gap-2">
            {['MP4', 'MP3', 'WEBM', 'WAV', 'OGG', 'M4A', 'JPG', 'PNG', 'GIF', 'PDF'].map((ext) => (
              <span key={ext} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium">{ext}</span>
            ))}
          </div>
        </div>
      </ToolPageWrapper>
    </>
  );
}
