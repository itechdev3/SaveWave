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
              OnlineFileTool
            </Link>
            <p className="text-sm leading-relaxed">
              Free browser-based file tools. No signup required. Works on all devices.
            </p>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Image Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/image-converter" className="hover:text-white transition-colors">Image Converter</Link></li>
              <li><Link to="/image-compressor" className="hover:text-white transition-colors">Image Compressor</Link></li>
              <li><Link to="/image-resizer" className="hover:text-white transition-colors">Image Resizer</Link></li>
              <li><Link to="/image-cropper" className="hover:text-white transition-colors">Image Cropper</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Audio & PDF</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/audio-converter" className="hover:text-white transition-colors">Audio Converter</Link></li>
              <li><Link to="/audio-compressor" className="hover:text-white transition-colors">Audio Compressor</Link></li>
              <li><Link to="/pdf-converter" className="hover:text-white transition-colors">PDF Converter</Link></li>
              <li><Link to="/pdf-compressor" className="hover:text-white transition-colors">PDF Compressor</Link></li>
              <li><Link to="/pdf-merge" className="hover:text-white transition-colors">PDF Merge</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">More</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/downloader" className="hover:text-white transition-colors">File Downloader</Link></li>
              <li>
                <a href="https://t.me/onlinefiletools" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Support (Telegram)
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-sm text-center">
          &copy; {new Date().getFullYear()} OnlineFileTool.com — All tools are free and browser-based.
        </div>
      </div>
    </footer>
  );
}
