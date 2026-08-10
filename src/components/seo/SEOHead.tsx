import { useEffect } from 'react';
import { SITE_CONFIG } from '../../config/site';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  type?: 'website' | 'article' | 'software';
  schemaData?: object | object[];
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalPath = '',
  type = 'website',
  schemaData,
}: SEOHeadProps) {
  useEffect(() => {
    // 1. Title
    const pageTitle = title ? `${title} — ${SITE_CONFIG.name}` : SITE_CONFIG.fullName;
    document.title = pageTitle;

    // 2. Meta Description
    const metaDesc = description || SITE_CONFIG.description;
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', metaDesc);

    // 3. Meta Keywords
    if (keywords && keywords.length > 0) {
      let keywordsTag = document.querySelector('meta[name="keywords"]');
      if (!keywordsTag) {
        keywordsTag = document.createElement('meta');
        keywordsTag.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsTag);
      }
      keywordsTag.setAttribute('content', keywords.join(', '));
    }

    // 4. Canonical Link
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : SITE_CONFIG.defaultDomain;
    const fullCanonicalUrl = `${currentOrigin}${canonicalPath}`;
    
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', fullCanonicalUrl);

    // 5. Open Graph Meta Tags
    const ogTags: Record<string, string> = {
      'og:title': pageTitle,
      'og:description': metaDesc,
      'og:url': fullCanonicalUrl,
      'og:type': type === 'software' ? 'website' : type,
      'og:site_name': SITE_CONFIG.name,
      'twitter:card': 'summary_large_image',
      'twitter:title': pageTitle,
      'twitter:description': metaDesc,
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      const selector = property.startsWith('twitter:')
        ? `meta[name="${property}"]`
        : `meta[property="${property}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (property.startsWith('twitter:')) {
          el.setAttribute('name', property);
        } else {
          el.setAttribute('property', property);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    });

    // 6. Structured Data (JSON-LD)
    const existingSchemaScript = document.getElementById('json-ld-schema');
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    if (schemaData) {
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, canonicalPath, type, schemaData]);

  return null;
}
