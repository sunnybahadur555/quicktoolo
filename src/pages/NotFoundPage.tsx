import React from 'react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/seo/SEOHead';
import { Search, Home, ArrowRight } from 'lucide-react';
import { TOOLS } from '../config/site';

export const NotFoundPage: React.FC = () => {
  const { navigate, setIsSearchOpen } = useApp();

  return (
    <div className="py-16 text-center max-w-xl mx-auto space-y-6">
      <SEOHead title="404 — Page Not Found" description="The requested page could not be found." />

      <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-3xl font-extrabold shadow-inner">
        404
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Page Not Found
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        The tool or page you are looking for might have been moved or does not exist.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => navigate('/')}
          className="w-full sm:w-auto py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full sm:w-auto py-3 px-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <Search className="w-4 h-4" />
          <span>Search Tools</span>
        </button>
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-left">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
          Popular Tools You Might Need
        </h4>
        <div className="space-y-2">
          {TOOLS.slice(0, 4).map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate(tool.slug)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-semibold text-slate-900 dark:text-white transition-colors"
            >
              <span>{tool.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
