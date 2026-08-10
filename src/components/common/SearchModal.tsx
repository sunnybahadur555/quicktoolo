import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TOOLS, CATEGORIES } from '../../config/site';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { IconRenderer } from './IconRenderer';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, navigate } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredTools = TOOLS.filter((tool) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      tool.title.toLowerCase().includes(query) ||
      tool.shortDesc.toLowerCase().includes(query) ||
      tool.keywords.some((k) => k.toLowerCase().includes(query))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="fixed inset-0"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. compress image, qr code, pdf merger)..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            ESC
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm">No online tools found matching "{searchQuery}"</p>
              <p className="text-xs mt-1 text-slate-400">Try searching for "PDF", "Image", "QR", or "JSON"</p>
            </div>
          ) : (
            filteredTools.map((tool) => {
              const category = CATEGORIES.find((c) => c.id === tool.category);
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    navigate(tool.slug);
                  }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <IconRenderer name={tool.iconName} size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {tool.title}
                        </span>
                        {category && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${category.badgeBg}`}>
                            {category.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {tool.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    <span className="text-xs font-semibold hidden sm:inline">Open</span>
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Search 10 free browser tools</span>
          <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
