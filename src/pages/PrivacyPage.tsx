import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SITE_CONFIG } from '../config/site';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SEOHead
        title="Privacy Policy"
        description={`Read the Privacy Policy for ${SITE_CONFIG.name}. Learn how our browser tools process data 100% locally with zero server uploads.`}
        canonicalPath="/privacy-policy"
      />

      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">Last updated: August 10, 2026</p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">1. Client-Side Data Processing</h2>
        <p>
          At {SITE_CONFIG.name}, we prioritize your privacy above all else. Every tool on this website (including Image Compressor, Image Resizer, PDF Merger, QR Code Generator, Word Counter, and JSON Formatter) operates 100% locally within your client browser. Your uploaded photos, PDF documents, text clips, and code snippets are never transmitted or stored on any external servers.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">2. Information We Do Not Collect</h2>
        <p>
          Because our application processes data entirely on your device, we do not store, copy, track, or inspect your personal files. No user account registration is required to access any feature of Toolvex.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">3. Cookies & Local Storage</h2>
        <p>
          We use browser standard LocalStorage solely to remember your UI display settings, such as your Light/Dark mode theme preference. No personal identification data or file contents are written to cookies or local storage.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">4. Third-Party Analytics & Web Hosting</h2>
        <p>
          Our hosting provider (Netlify) may record standard anonymous server logs (such as IP addresses, browser user-agents, and request timestamps) strictly for security monitoring and bandwidth delivery optimization.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">5. Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be published on this page with an updated revision date.
        </p>
      </div>
    </div>
  );
};
