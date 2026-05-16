import { Link } from 'react-router-dom';
import { Image, Music, FileText, Download, ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const tools = [
  { icon: Image, title: 'Image Tools', desc: 'Convert, compress, and resize images', link: '/image-tools' },
  { icon: Music, title: 'Audio Tools', desc: 'Convert and compress audio files', link: '/audio-tools' },
  { icon: FileText, title: 'PDF Tools', desc: 'Merge, compress, and convert PDFs', link: '/pdf-tools' },
  { icon: Download, title: 'Downloader', desc: 'Download media files and content', link: '/downloader' },
];

const features = [
  { icon: Shield, title: 'Private & Secure', desc: 'All processing happens in your browser' },
  { icon: Zap, title: 'Lightning Fast', desc: 'No uploads, instant results' },
  { icon: Globe, title: 'Works Everywhere', desc: 'Mobile and desktop compatible' },
];

const faqs = [
  { q: 'Is this really free?', a: 'Yes, all tools are completely free with no hidden charges or account required.' },
  { q: 'Are my files secure?', a: 'Absolutely. Files are processed locally in your browser and never uploaded anywhere.' },
  { q: 'Does it work on mobile?', a: 'Yes, all tools are fully responsive and work on iOS and Android devices.' },
  { q: 'Do I need to sign up?', a: 'No signup required. Use any tool immediately without creating an account.' },
];

export default function Home() {
  return (
    <>
      <SEOHead
        title="Free Online File Tools – Convert, Compress & Download Files"
        description="Free online tools for converting images, audio, PDFs and downloading files. No signup, no installation required."
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-400 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Free Online File Tools
          </h1>
          <p className="text-lg sm:text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
            Convert, compress, edit and download files easily online. No installation, no signup, completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/image-tools"
              className="inline-flex items-center gap-2 bg-white text-sky-600 font-semibold px-8 py-3 rounded-lg hover:bg-sky-50 transition-colors"
            >
              Start Converting <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://t.me/onlinefiletools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sky-700/40 hover:bg-sky-700/60 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get Support
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          All Our Free Tools
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {tools.map(({ icon: Icon, title, desc, link }) => (
            <Link
              key={link}
              to={link}
              className="group bg-white rounded-2xl border border-gray-200 p-8 hover:border-sky-300 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-100 transition-colors">
                <Icon className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                {title}
              </h3>
              <p className="text-gray-600">{desc}</p>
              <div className="mt-4 flex items-center gap-2 text-sky-600 font-medium">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            The Best Free Online File Tools
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
            <p>
              Looking for free online tools? Online File Tools is your go-to platform for converting, compressing, and downloading files without any hassle. Whether you need an <strong>image converter online</strong>, <strong>audio converter online</strong>, or <strong>PDF tools free</strong>, we have you covered.
            </p>
            <p>
              Our tools run entirely in your browser, ensuring your files stay private and processing is lightning fast. No installation required, no account needed – just visit, use, and download your converted files.
            </p>
            <p>
              With support for all popular formats including PNG, JPG, MP3, WAV, and PDF, Online File Tools is perfect for students, professionals, content creators, and anyone needing quick file conversion without downloading additional software.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  {q}
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                  {a}
                </div>
              </details>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
