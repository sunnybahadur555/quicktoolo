import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';
import { SearchModal } from './components/common/SearchModal';
import { TOOLS } from './config/site';

// Pages
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { AllToolsPage } from './pages/AllToolsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { SitemapPage } from './pages/SitemapPage';
import { NotFoundPage } from './pages/NotFoundPage';

const RouterContent: React.FC = () => {
  const { currentPath } = useApp();

  const renderRoute = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage />;
    }
    if (currentPath === '/all-tools') {
      return <AllToolsPage />;
    }
    if (currentPath === '/categories') {
      return <CategoriesPage />;
    }
    if (currentPath.startsWith('/category/')) {
      const catId = currentPath.replace('/category/', '');
      return <CategoriesPage categoryId={catId} />;
    }
    if (currentPath === '/about') {
      return <AboutPage />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }
    if (currentPath === '/privacy-policy') {
      return <PrivacyPage />;
    }
    if (currentPath === '/terms-of-service') {
      return <TermsPage />;
    }
    if (currentPath === '/disclaimer') {
      return <DisclaimerPage />;
    }
    if (currentPath === '/sitemap') {
      return <SitemapPage />;
    }

    // Match individual tool slugs
    const matchedTool = TOOLS.find(
      (t) => t.slug === currentPath || t.id === currentPath.replace('/', '')
    );
    if (matchedTool) {
      return <ToolPage toolId={matchedTool.id} />;
    }

    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {renderRoute()}
      </main>
      <Footer />
      <ToastContainer />
      <SearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <RouterContent />
    </AppProvider>
  );
}
