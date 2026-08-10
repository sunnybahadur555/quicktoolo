import React from 'react';
import { HowToStep } from '../../types';

interface HowToSectionProps {
  toolTitle: string;
  steps: HowToStep[];
}

export const HowToSection: React.FC<HowToSectionProps> = ({ toolTitle, steps }) => {
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 my-8 shadow-sm">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Instructions</span>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
        How to Use {toolTitle}
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        Follow these simple step-by-step instructions to quickly accomplish your task with complete privacy.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((stepItem) => (
          <div
            key={stepItem.step}
            className="relative bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-lg p-5"
          >
            <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3 shadow-sm shadow-blue-200 dark:shadow-none">
              {stepItem.step}
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
              {stepItem.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {stepItem.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
