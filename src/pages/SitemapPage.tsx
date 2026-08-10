import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useApp } from '../context/AppContext';
import { SITE_CONFIG, CATEGORIES, TOOLS } from '../config/site';
import { FileCode, Globe, Layers, ArrowUpRight } from 'lucide-react';

export const SitemapPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SEOHead
        title="HTML Sitemap"
        description="Index of all free online tools, categories, and legal pages on QuickToolo."
        canonicalPath="/sitemap"
      />

      <Breadcrumbs items={[{ label: 'HTML Sitemap' }]} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Website Sitemap
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Complete index of all public tool pages and structural links.
            </p>
          </div>

          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <FileCode className="w-4 h-4" />
            <span>View Raw sitemap.xml</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Categories & Tools */}
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" />
              <span>Online Tools by Category</span>
            </h2>

            <div className="space-y-6">
              {CATEGORIES.map((cat) => {
                const categoryTools = TOOLS.filter((t) => t.category === cat.id);
                return (
                  <div key={cat.id} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <button
                      onClick={() => navigate(`/category/${cat.id}`)}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors mb-3 block"
                    >
                      {cat.name} ({categoryTools.length})
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {categoryTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => navigate(tool.slug)}
                          className="text-left text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        >
                          • {tool.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Site Pages */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <span>Main Pages & Legal</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <button onClick={() => navigate('/')} className="text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Home Page
              </button>
              <button onClick={() => navigate('/all-tools')} className="text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                All Tools
              </button>
              <button onClick={() => navigate('/categories')} className="text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Tool Categories
              </button>
              <button onClick={() => navigate('/about')} className="text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                About Us
              </button>
              <button onClick={() => navigate('/contact')} className="text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Contact Us
              </button>
              <button onClick={() => navigate('/privacy-policy')} className="text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => navigate('/terms-of-service')} className="text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Terms of Service
              </button>
              <button onClick={() => navigate('/disclaimer')} className="text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Disclaimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
