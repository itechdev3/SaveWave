import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Zap className="w-5 h-5 text-sky-400" />
              Online File Tools
            </Link>
            <p className="text-sm">Free, fast, and secure online file conversion tools.</p>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Image Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/image-tools" className="hover:text-white transition-colors">All Image Tools</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Audio & PDF</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/audio-tools" className="hover:text-white transition-colors">Audio Tools</Link></li>
              <li><Link to="/pdf-tools" className="hover:text-white transition-colors">PDF Tools</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">More</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/downloader" className="hover:text-white transition-colors">Downloader</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-sm text-center">
          © {new Date().getFullYear()} Online File Tools. All tools are free and browser-based.
        </div>
      </div>
    </footer>
  );
}
