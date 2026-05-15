import { Link } from 'react-router-dom';
import { Image, Music, FileText, Download, ArrowRight, Shield, Zap, Globe, Star } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import FAQSection from '../components/FAQSection';

const toolCategories = [
  {
    icon: Image, title: 'Image Tools', color: 'bg-sky-50 text-sky-600 border-sky-200', iconBg: 'bg-sky-100',
    description: 'Convert, compress, resize and crop images online for free.',
    tools: [
      { label: 'Image Converter', to: '/image-converter', desc: 'PNG to JPG to WEBP' },
      { label: 'Image Compressor', to: '/image-compressor', desc: 'Reduce file size' },
      { label: 'Image Resizer', to: '/image-resizer', desc: 'Resize with presets' },
      { label: 'Image Cropper', to: '/image-cropper', desc: 'Crop and trim' },
    ],
  },
  {
    icon: Music, title: 'Audio Tools', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', iconBg: 'bg-emerald-100',
    description: 'Convert and compress audio files directly in your browser.',
    tools: [
      { label: 'Audio Converter', to: '/audio-converter', desc: 'MP3 to WAV to M4A' },
      { label: 'Audio Compressor', to: '/audio-compressor', desc: 'Reduce audio size' },
    ],
  },
  {
    icon: FileText, title: 'PDF Tools', color: 'bg-orange-50 text-orange-600 border-orange-200', iconBg: 'bg-orange-100',
    description: 'Convert, compress and merge PDF files with ease.',
    tools: [
      { label: 'PDF Converter', to: '/pdf-converter', desc: 'Image to PDF' },
      { label: 'PDF Compressor', to: '/pdf-compressor', desc: 'Shrink PDF size' },
      { label: 'PDF Merge', to: '/pdf-merge', desc: 'Combine PDFs' },
    ],
  },
  {
    icon: Download, title: 'Downloader', color: 'bg-rose-50 text-rose-600 border-rose-200', iconBg: 'bg-rose-100',
    description: 'Download direct media URLs safely and quickly.',
    tools: [
      { label: 'File Downloader', to: '/downloader', desc: 'Direct URL download' },
    ],
  },
];

const features = [
  { icon: Shield, title: '100% Private', desc: 'Files processed in your browser — never uploaded to any server.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Browser-based processing means instant results with no wait times.' },
  { icon: Globe, title: 'Works Everywhere', desc: 'Fully responsive and tested on desktop, tablet and mobile.' },
  { icon: Star, title: 'Always Free', desc: 'No subscriptions, no limits, no hidden fees. Free forever.' },
];

const homeFaqs = [
  { q: 'Are these tools really free?', a: 'Yes — every tool on OnlineFileTool.com is completely free to use, forever. No account or payment required.' },
  { q: 'Is it safe to use these tools?', a: 'Absolutely. All file processing happens in your browser using modern Web APIs. Your files never leave your device.' },
  { q: 'Do these tools work on mobile?', a: 'Yes. Every tool is designed mobile-first and works great on iOS and Android browsers.' },
  { q: 'What formats are supported?', a: 'We support all major formats: PNG, JPG, WEBP for images; MP3, WAV, M4A for audio; and standard PDF for documents.' },
  { q: 'Do I need to install anything?', a: 'No installation required. Everything runs directly in your web browser with no plugins or software needed.' },
];

export default function Home() {
  return (
    <>
      <SEOHead
        title="Free Online File Tools – Image, Audio, PDF & Converter Tools | OnlineFileTool.com"
        description="Free browser-based tools for converting, compressing, resizing images, converting audio files, merging PDFs, and downloading direct media URLs. No signup, no install."
        canonical="https://onlinefiletool.com/"
      />

      <section className="bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Free · No signup · Browser-based
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight">
            Free Online File, Image,<br />Audio &amp; PDF Tools
          </h1>
          <p className="text-sky-100 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Fast, secure, browser-based utility tools for everyone. Convert images, compress audio, merge PDFs and more — no installation required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#tools" className="inline-flex items-center gap-2 bg-white text-sky-600 font-semibold px-6 py-3 rounded-xl hover:bg-sky-50 transition-colors shadow-md">
              Start Using Free Tools <ArrowRight className="w-4 h-4" />
            </a>
            <a href="https://t.me/onlinefiletools" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-sky-700/40 hover:bg-sky-700/60 font-medium px-6 py-3 rounded-xl transition-colors">
              Get Support
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-sky-500" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">All Free Online Tools</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Choose from our growing collection of free online file converter tools. No account needed.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {toolCategories.map(({ icon: Icon, title, color, iconBg, description, tools }) => (
            <div key={title} className={`rounded-2xl border p-6 ${color}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">{description}</p>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((tool) => (
                  <Link key={tool.to} to={tool.to} className="flex flex-col bg-white rounded-xl px-4 py-3 hover:shadow-md transition-all group border border-transparent hover:border-gray-200">
                    <span className="font-medium text-gray-900 text-sm group-hover:text-sky-600 transition-colors">{tool.label}</span>
                    <span className="text-gray-400 text-xs mt-0.5">{tool.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">The Best Free Online File Converter Tools</h2>
          <div className="text-gray-600 space-y-4 text-sm leading-relaxed">
            <p>
              Looking for a free <strong>online file converter</strong>? OnlineFileTool.com offers a complete suite of browser-based tools that run entirely on your device. Whether you need an <strong>image compressor online</strong>, a <strong>PDF merge tool online</strong>, or an <strong>audio converter online</strong>, we have you covered — all at zero cost.
            </p>
            <p>
              Our <strong>free online tools</strong> are designed for speed and privacy. Unlike cloud-based converters that upload your files to remote servers, all processing happens locally in your browser using modern Web APIs. This means your sensitive documents and media files never leave your device.
            </p>
            <p>
              With support for all major formats — PNG, JPG, WEBP, MP3, WAV, M4A, and PDF — our platform is the go-to destination for students, designers, content creators and professionals who need fast, reliable file conversion tools without signing up or paying.
            </p>
          </div>
        </div>
      </section>

      <FAQSection faqs={homeFaqs} title="Frequently Asked Questions" />
    </>
  );
}
