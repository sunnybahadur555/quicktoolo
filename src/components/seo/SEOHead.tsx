import { useEffect } from 'react';
import { SITE_CONFIG } from '../../config/site';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  type?: 'website' | 'article' | 'software';
  image?: string;
  noIndex?: boolean;
  schemaData?: object | object[];
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalPath = '',
  type = 'website',
  image,
  noIndex = false,
  schemaData,
}: SEOHeadProps) {
  useEffect(() => {
    // 1. Title
    let pageTitle = SITE_CONFIG.fullName;
    if (title) {
      if (title.includes('Quick Toolo') || title.includes('QuickToolo')) {
        pageTitle = title;
      } else {
        pageTitle = `${title} | ${SITE_CONFIG.name}`;
      }
    }
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

    // 3. Robots Meta Tag
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 4. Meta Keywords
    if (keywords && keywords.length > 0) {
      let keywordsTag = document.querySelector('meta[name="keywords"]');
      if (!keywordsTag) {
        keywordsTag = document.createElement('meta');
        keywordsTag.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsTag);
      }
      keywordsTag.setAttribute('content', keywords.join(', '));
    }

    // 5. Canonical Link
    const baseDomain = SITE_CONFIG.defaultDomain;
    const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    const fullCanonicalUrl = canonicalPath === '/' ? `${baseDomain}/` : `${baseDomain}${cleanPath}`;
    
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', fullCanonicalUrl);

    // 6. Open Graph & Twitter Meta Tags
    const previewImage = image || `${baseDomain}/vite.svg`;

    const ogTags: Record<string, string> = {
      'og:title': pageTitle,
      'og:description': metaDesc,
      'og:url': fullCanonicalUrl,
      'og:type': type === 'software' ? 'website' : type,
      'og:site_name': SITE_CONFIG.name,
      'og:image': previewImage,
      'twitter:card': 'summary_large_image',
      'twitter:title': pageTitle,
      'twitter:description': metaDesc,
      'twitter:image': previewImage,
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

    // 7. Structured Data (JSON-LD)
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
  }, [title, description, keywords, canonicalPath, type, image, noIndex, schemaData]);

  return null;
}
