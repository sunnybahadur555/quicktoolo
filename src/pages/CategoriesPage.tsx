import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, TOOLS } from '../config/site';
import { SEOHead } from '../components/seo/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ToolCard } from '../components/common/ToolCard';
import { IconRenderer } from '../components/common/IconRenderer';

interface CategoriesPageProps {
  categoryId?: string;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ categoryId }) => {
  const { navigate } = useApp();

  // Single category view
  if (categoryId) {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    const categoryTools = TOOLS.filter((t) => t.category === categoryId);

    if (!category) {
      return (
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <button onClick={() => navigate('/categories')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-xs">
            View All Categories
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <SEOHead
          title={`${category.name} — Free Online Tools`}
          description={category.description}
          canonicalPath={`/category/${category.id}`}
        />

        <Breadcrumbs
          items={[
            { label: 'Categories', path: '/categories' },
            { label: category.name },
          ]}
        />

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${category.color} text-white flex items-center justify-center shadow-md`}>
              <IconRenderer name={category.iconName} size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {category.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    );
  }

  // Categories Overview View
  return (
    <div className="space-y-8">
      <SEOHead
        title="Tool Categories"
        description="Explore free online tools organized by category: Image tools, PDF tools, QR tools, text tools, and developer tools."
        canonicalPath="/categories"
      />

      <Breadcrumbs items={[{ label: 'Categories' }]} />

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tool Categories
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Select a category to view specialized free browser tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => {
          const categoryTools = TOOLS.filter((t) => t.category === category.id);
          return (
            <div
              key={category.id}
              onClick={() => navigate(`/category/${category.id}`)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-blue-500 transition-all cursor-pointer shadow-sm group space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} text-white flex items-center justify-center shadow-md`}>
                  <IconRenderer name={category.iconName} size={22} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${category.badgeBg}`}>
                  {categoryTools.length} Tools
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 font-bold text-xs text-blue-600 dark:text-blue-400">
                Explore {category.name} →
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
