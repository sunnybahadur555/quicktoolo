import React from 'react';
import { TOOLS } from '../../config/site';
import { ToolCard } from './ToolCard';

interface RelatedToolsProps {
  currentToolId: string;
  relatedIds?: string[];
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ currentToolId, relatedIds = [] }) => {
  const relatedTools = TOOLS.filter(
    (t) => t.id !== currentToolId && relatedIds.includes(t.id)
  );

  const fallbackTools = TOOLS.filter(
    (t) => t.id !== currentToolId && !relatedIds.includes(t.id)
  ).slice(0, 3 - relatedTools.length);

  const displayTools = [...relatedTools, ...fallbackTools].slice(0, 3);

  if (displayTools.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">More Utilities</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Related Online Tools
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Explore more free utilities to streamline your daily tasks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
};
