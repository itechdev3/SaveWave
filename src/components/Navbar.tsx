import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Image Tools', path: '/image-tools' },
  { label: 'Audio Tools', path: '/audio-tools' },
  { label: 'PDF Tools', path: '/pdf-tools' },
  { label: 'Downloader', path: '/downloader' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <Zap className="w-6 h-6 text-sky-500" />
            <span>Online File Tools</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium transition-colors ${
                  pathname === path
                    ? 'text-sky-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
