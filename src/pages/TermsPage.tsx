import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SITE_CONFIG } from '../config/site';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SEOHead
        title="Terms of Service"
        description={`Terms of Service for using ${SITE_CONFIG.name} free browser online tools.`}
        canonicalPath="/terms-of-service"
      />

      <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">Last updated: August 10, 2026</p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">1. Acceptance of Terms</h2>
        <p>
          By accessing and using {SITE_CONFIG.name}, you agree to abide by these Terms of Service. If you do not agree with any part of these terms, you should discontinue using the website.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">2. Permitted Use</h2>
        <p>
          You are granted a non-exclusive, free, revocable license to use all tools available on QuickToolo for personal, educational, and commercial purposes.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">3. Prohibited Activities</h2>
        <p>
          You agree not to attempt to reverse engineer, disrupt, or exploit the platform infrastructure or transmit malicious software through automated interactions.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">4. Disclaimer of Warranty</h2>
        <p>
          All online tools are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, express or implied. We do not guarantee uninterrupted access or error-free outputs.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">5. Limitation of Liability</h2>
        <p>
          In no event shall {SITE_CONFIG.name} or its operators be liable for any direct, indirect, incidental, or consequential damages resulting from the use of our services.
        </p>
      </div>
    </div>
  );
};
