import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const navGroups = [
  {
    label: 'Image Tools',
    links: [
      { label: 'Converter', to: '/image-converter' },
      { label: 'Compressor', to: '/image-compressor' },
      { label: 'Resizer', to: '/image-resizer' },
      { label: 'Cropper', to: '/image-cropper' },
    ],
  },
  {
    label: 'Audio Tools',
    links: [
      { label: 'Converter', to: '/audio-converter' },
      { label: 'Compressor', to: '/audio-compressor' },
    ],
  },
  {
    label: 'PDF Tools',
    links: [
      { label: 'Converter', to: '/pdf-converter' },
      { label: 'Compressor', to: '/pdf-compressor' },
      { label: 'Merge', to: '/pdf-merge' },
    ],
  },
  {
    label: 'Downloader',
    links: [{ label: 'File Downloader', to: '/downloader' }],
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <Zap className="w-6 h-6 text-sky-500" />
            <span>OnlineFileTool</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-sky-600 bg-sky-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            {navGroups.map((group) => (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setActiveGroup(group.label)}
                onMouseLeave={() => setActiveGroup(null)}
              >
                <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  {group.label}
                </button>
                {activeGroup === group.label && (
                  <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                    {group.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          pathname === link.to
                            ? 'text-sky-600 bg-sky-50'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">
                  {group.label}
                </p>
                {group.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
