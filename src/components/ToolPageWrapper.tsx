import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import FAQSection from './FAQSection';

interface ToolPageWrapperProps {
  title: string;
  description: string;
  breadcrumb: { label: string; to?: string }[];
  children: ReactNode;
  faqs?: { q: string; a: string }[];
  adSlot?: boolean;
}

export default function ToolPageWrapper({ title, description, breadcrumb, children, faqs, adSlot = true }: ToolPageWrapperProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-1 text-xs text-gray-500 mb-6">
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3 h-3" />}
            {crumb.to ? (
              <Link to={crumb.to} className="hover:text-sky-600 transition-colors">{crumb.label}</Link>
            ) : (
              <span className="text-gray-700">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
      </div>

      {adSlot && (
        <div className="bg-gray-100 border border-dashed border-gray-300 rounded-xl p-4 text-center text-xs text-gray-400 mb-8">
          Advertisement Slot — 728x90
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
        {children}
      </div>

      {faqs && <FAQSection faqs={faqs} />}

      {adSlot && (
        <div className="bg-gray-100 border border-dashed border-gray-300 rounded-xl p-4 text-center text-xs text-gray-400 mt-8">
          Advertisement Slot — 728x90
        </div>
      )}
    </div>
  );
}
