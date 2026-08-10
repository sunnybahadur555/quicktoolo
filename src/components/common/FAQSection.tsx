import React, { useState } from 'react';
import { FAQItem } from '../../types';
import { ChevronDown } from 'lucide-react';

interface FAQSectionProps {
  title?: string;
  description?: string;
  faqs: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  title = 'Frequently Asked Questions',
  description = 'Everything you need to know about this online tool.',
  faqs,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 my-8 shadow-sm">
      <div className="mb-6">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Knowledge Base</span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-4 text-sm"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 bg-slate-50/50 dark:bg-slate-800/30">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
