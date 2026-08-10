import React from 'react';
import { useApp } from '../context/AppContext';
import { TOOLS, CATEGORIES, SITE_CONFIG } from '../config/site';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { HowToSection } from '../components/common/HowToSection';
import { FAQSection } from '../components/common/FAQSection';
import { RelatedTools } from '../components/common/RelatedTools';
import { IconRenderer } from '../components/common/IconRenderer';
import { ShieldCheck, Check } from 'lucide-react';

// Tool Components
import { QRCodeGeneratorTool } from '../components/tools/QRCodeGenerator';
import { ImageCompressorTool } from '../components/tools/ImageCompressor';
import { ImageResizerTool } from '../components/tools/ImageResizer';
import { JpgToPngConverterTool } from '../components/tools/JpgToPngConverter';
import { PngToJpgConverterTool } from '../components/tools/PngToJpgConverter';
import { ImageToPdfConverterTool } from '../components/tools/ImageToPdfConverter';
import { PdfMergerTool } from '../components/tools/PdfMerger';
import { PdfCompressorTool } from '../components/tools/PdfCompressor';
import { WordCounterTool } from '../components/tools/WordCounter';
import { JsonFormatterTool } from '../components/tools/JsonFormatter';

interface ToolPageProps {
  toolId: string;
}

export const ToolPage: React.FC<ToolPageProps> = ({ toolId }) => {
  const { navigate } = useApp();
  const tool = TOOLS.find((t) => t.id === toolId || t.slug === `/${toolId}`);

  if (!tool) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-xs shadow-sm"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === tool.category);

  // Render correct tool component
  const renderToolComponent = () => {
    switch (tool.id) {
      case 'qr-code-generator':
        return <QRCodeGeneratorTool />;
      case 'image-compressor':
        return <ImageCompressorTool />;
      case 'image-resizer':
        return <ImageResizerTool />;
      case 'jpg-to-png':
        return <JpgToPngConverterTool />;
      case 'png-to-jpg':
        return <PngToJpgConverterTool />;
      case 'image-to-pdf':
        return <ImageToPdfConverterTool />;
      case 'pdf-merger':
        return <PdfMergerTool />;
      case 'pdf-compressor':
        return <PdfCompressorTool />;
      case 'word-counter':
        return <WordCounterTool />;
      case 'json-formatter':
        return <JsonFormatterTool />;
      default:
        return null;
    }
  };

  const domain = typeof window !== 'undefined' ? window.location.origin : SITE_CONFIG.defaultDomain;

  // Schema structured data
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: `${domain}${tool.slug}`,
    description: tool.shortDesc,
    applicationCategory: category ? category.name : 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: domain },
      { '@type': 'ListItem', position: 2, name: category?.name || 'Tools', item: `${domain}/category/${tool.category}` },
      { '@type': 'ListItem', position: 3, name: tool.title, item: `${domain}${tool.slug}` },
    ],
  };

  return (
    <div className="space-y-8">
      <SEOHead
        title={tool.title}
        description={tool.shortDesc}
        canonicalPath={tool.slug}
        keywords={tool.keywords}
        type="software"
        schemaData={[webAppSchema, faqSchema, breadcrumbSchema]}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: category?.name || 'Tools', path: `/category/${tool.category}` },
          { label: tool.title },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-200 dark:shadow-none">
            <IconRenderer name={tool.iconName} size={24} />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${category?.badgeBg}`}>
                {category?.name}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Client-Side Privacy
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {tool.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {tool.longDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Tool Working Interface */}
      {renderToolComponent()}

      {/* Step-by-Step How To Guide */}
      <HowToSection toolTitle={tool.title} steps={tool.howToSteps} />

      {/* Key Features List */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Capabilities</span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Key Features of {tool.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tool.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-lg">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Tool Specific FAQ */}
      <FAQSection
        title={`${tool.title} — Frequently Asked Questions`}
        faqs={tool.faq}
      />

      {/* Related Tools */}
      <RelatedTools currentToolId={tool.id} relatedIds={tool.relatedToolIds} />
    </div>
  );
};
