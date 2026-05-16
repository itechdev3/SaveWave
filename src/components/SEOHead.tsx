import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
}

export default function SEOHead({ title, description }: SEOHeadProps) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (meta) meta.content = description;
  }, [title, description]);

  return null;
}
