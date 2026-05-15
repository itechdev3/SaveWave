declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_ID = 'G-9Y6XL6XCTW';

export function initGA() {
  if (!GA_ID) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

export function trackEvent(action: string, category: string, label?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, { event_category: category, event_label: label });
  }
}

export function trackToolUsage(tool: string) {
  trackEvent('tool_use', 'Tools', tool);
}

export function trackDownload(tool: string) {
  trackEvent('download', 'Downloads', tool);
}
