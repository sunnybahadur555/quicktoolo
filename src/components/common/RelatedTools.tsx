import React from 'react';
import { TOOLS } from '../../config/site';
import { ToolCard } from './ToolCard';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';

interface RelatedToolsProps {
  currentToolId: string;
  relatedIds?: string[];
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ currentToolId, relatedIds = [] }) => {
  const { navigate } = useApp();

  const relatedTools = TOOLS.filter(
    (t) =>
      t.id !== currentToolId &&
      (relatedIds.includes(t.id) || (t.aliases && t.aliases.some((a) => relatedIds.includes(a))))
  );

  const fallbackTools = TOOLS.filter(
    (t) => t.id !== currentToolId && !relatedTools.some((rt) => rt.id === t.id)
  ).slice(0, Math.max(0, 3 - relatedTools.length));

  const displayTools = [...relatedTools, ...fallbackTools].slice(0, 3);

  if (displayTools.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">More Utilities</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Explore More Tools
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Discover other free browser utilities to speed up your workflow.
          </p>
        </div>

        <button
          onClick={() => navigate('/all-tools')}
          className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>View All 10 Tools</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
};
