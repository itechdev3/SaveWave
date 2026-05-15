import { MessageCircle } from 'lucide-react';

export default function SupportButton() {
  return (
    <a
      href="https://t.me/onlinefiletools"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105 text-sm font-medium"
      aria-label="Support via Telegram"
    >
      <MessageCircle className="w-4 h-4" />
      <span className="hidden sm:inline">Support</span>
    </a>
  );
}
