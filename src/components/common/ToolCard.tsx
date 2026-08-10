import React from 'react';
import { Tool } from '../../types';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../config/site';
import { IconRenderer } from './IconRenderer';
import { ArrowRight, Star } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { navigate } = useApp();
  const category = CATEGORIES.find((c) => c.id === tool.category);

  return (
    <div
      onClick={() => navigate(tool.slug)}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-all duration-200 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/60 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
            <IconRenderer name={tool.iconName} size={20} />
          </div>

          <div className="flex items-center gap-2">
            {tool.popular && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Popular
              </span>
            )}
            {category && (
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${category.badgeBg}`}>
                {category.name}
              </span>
            )}
          </div>
        </div>

        <h3 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {tool.title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {tool.shortDesc}
        </p>
      </div>

      <div className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <span>Use Tool</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
      </div>
    </div>
  );
};
