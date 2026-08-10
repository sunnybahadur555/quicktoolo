import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SITE_CONFIG, CATEGORIES, TOOLS, GENERAL_FAQS } from '../config/site';
import { SEOHead } from '../components/seo/SEOHead';
import { ToolCard } from '../components/common/ToolCard';
import { IconRenderer } from '../components/common/IconRenderer';
import { FAQSection } from '../components/common/FAQSection';
import { Search, Shield, Zap, Sparkles, CheckCircle, Lock, ArrowRight, Smartphone, Star } from 'lucide-react';
import { CategoryId } from '../types';

export const HomePage: React.FC = () => {
  const { navigate, setIsSearchOpen } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesQuery =
      tool.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const popularTools = TOOLS.filter((t) => t.popular);

  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: typeof window !== 'undefined' ? window.location.origin : SITE_CONFIG.defaultDomain,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${typeof window !== 'undefined' ? window.location.origin : SITE_CONFIG.defaultDomain}/all-tools?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      <SEOHead
        title="Free Online Tools for Everyday Tasks"
        description="Fast, simple and free tools for images, PDFs, QR codes, text and more. No registration required, 100% private and browser-based."
        canonicalPath="/"
        keywords={['free online tools', 'pdf merger', 'image compressor', 'qr code generator', 'word counter', 'json formatter']}
        schemaData={homeSchema}
      />

      {/* Hero Section */}
      <section className="relative pt-6 pb-10 sm:pt-12 sm:pb-16 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>100% Free • No Registration Required • 100% Browser Privacy</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
          Free Online Tools for <span className="text-blue-600">Everyday Tasks</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Fast, simple, and free utilities for images, PDFs, QR codes, text, and developers. Process everything directly in your browser without cloud uploads.
        </p>

        {/* Hero Search Box */}
        <div className="max-w-xl mx-auto relative mb-8">
          <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm p-1.5 transition-all focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/40">
            <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search 10 free tools (e.g. PDF merger, compress photo, QR code)..."
              className="w-full px-3 py-2 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none placeholder-slate-400"
            />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-full shadow-sm shadow-blue-200 dark:shadow-none transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </div>

        {/* Quick Category Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            All Tools ({TOOLS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Popular Tools Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Most Popular Tools
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Top browser utilities trusted by thousands of users daily.
            </p>
          </div>

          <button
            onClick={() => navigate('/all-tools')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>View All Tools</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularTools.slice(0, 6).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Category Explorer Cards */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Explore Collections</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Browse by Tool Category
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Find specialized browser utilities tailored for media, documents, code, and text.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => {
            const count = TOOLS.filter((t) => t.category === category.id).length;
            return (
              <div
                key={category.id}
                onClick={() => navigate(`/category/${category.id}`)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <IconRenderer name={category.iconName} size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {category.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>{count} Tools</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* All Filtered Tools Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {selectedCategory === 'all' ? 'All Free Online Tools' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Showing {filteredTools.length} functional tool(s) ready to use.
            </p>
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 text-sm">No tools found matching "{searchFilter}"</p>
            <button
              onClick={() => {
                setSearchFilter('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* Benefits & Features Section */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 shadow-md border border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">
            Why Choose Toolvex
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Designed for Speed, Security & Simplicity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">100% Client-Side Privacy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your files and input data never leave your web browser. All compression, merging, and rendering happen strictly in local memory.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Lightning Fast Speed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero network upload delays or server queues. Process massive images, PDFs, and text documents in milliseconds.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Free Forever & Mobile Ready</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No registration, account creation, or hidden paywalls. Works seamlessly across desktop computers, tablets, and smartphones.
            </p>
          </div>
        </div>
      </section>

      {/* Global FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        description="Learn more about our free browser tools and privacy protections."
        faqs={GENERAL_FAQS}
      />
    </div>
  );
};
