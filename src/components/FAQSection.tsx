import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ { q: string; a: string }

const defaultFaqs: FAQ[] = [
  { q: 'Is this tool free?', a: 'Yes, all tools on OnlineFileTool.com are completely free to use with no account required.' },
  { q: 'Is it safe to upload my files?', a: 'Your files are processed entirely in your browser and never uploaded to our servers, ensuring complete privacy.' },
  { q: 'Does it work on mobile?', a: 'Yes, all tools are fully responsive and optimized for mobile browsers including iOS Safari and Android Chrome.' },
  { q: 'What file sizes are supported?', a: 'Most tools support files up to 100MB. Processing happens in your browser so performance depends on your device.' },
];

export default function FAQSection({ faqs = defaultFaqs, title = 'Frequently Asked Questions' }: { faqs?: FAQ[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 ml-4 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
