import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SITE_CONFIG } from '../config/site';
import { ShieldCheck, Zap, Heart, Lock, Code, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <SEOHead
        title="About Us"
        description={`Learn about ${SITE_CONFIG.name}, our mission to provide fast, free, 100% private online tools for everyday tasks.`}
        canonicalPath="/about"
      />

      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Our Story & Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About {SITE_CONFIG.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Toolvex was created with a single objective: to build clean, ultra-fast, 100% free online tools that run completely inside the user's web browser without requiring accounts, subscriptions, or privacy trade-offs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <Lock className="w-8 h-8 text-emerald-500 mb-2" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Zero Server Uploads</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Unlike traditional SaaS websites that process files on remote cloud servers, Toolvex uses modern WebAssembly, Canvas, and browser memory APIs. Your photos, PDFs, and text remain on your device.
            </p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <Zap className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Instant Speed</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Eliminate bandwidth wait times. Because operations run locally, image compression, PDF merging, and QR generation execute in milliseconds.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Core Commitments</h2>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <span><strong>Free Forever:</strong> All tools are 100% free to use for personal and commercial projects without usage limitations.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>No Account Needed:</strong> Jump straight to solving your task without fill-out forms or email logins.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Code className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
              <span><strong>Mobile Friendly:</strong> Responsive layouts engineered to work on phones, tablets, laptops, and desktop computers.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
