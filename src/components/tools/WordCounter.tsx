import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Copy, Trash2, Clock, AlignLeft, Sparkles, FileText } from 'lucide-react';

export const WordCounterTool: React.FC = () => {
  const { addToast } = useApp();
  const [text, setText] = useState<string>(
    'Free Online Tools for Everyday Tasks. QuickToolo provides fast, simple, and free tools for images, PDFs, QR codes, text, and JSON. No registration or credit card required.'
  );

  // Statistics calculation
  const cleanText = text.trim();
  const wordsArray = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
  const wordCount = wordsArray.length;
  const charCountWithSpaces = text.length;
  const charCountNoSpaces = text.replace(/\s+/g, '').length;
  const sentenceCount = cleanText ? (cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText]).length : 0;
  const paragraphCount = cleanText ? cleanText.split(/\n+/).filter(Boolean).length : 0;

  const readingTimeMinutes = Math.ceil(wordCount / 200);
  const speakingTimeMinutes = Math.ceil(wordCount / 130);

  // Top Keywords calculation
  const keywordFrequency: Record<string, number> = {};
  wordsArray.forEach((w) => {
    const word = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (word.length > 2) {
      keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
    }
  });

  const sortedKeywords = Object.entries(keywordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Text transformations
  const applyTransform = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'cleanSpaces') => {
    if (!text) return;
    if (type === 'upper') {
      setText(text.toUpperCase());
    } else if (type === 'lower') {
      setText(text.toLowerCase());
    } else if (type === 'title') {
      setText(
        text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      );
    } else if (type === 'sentence') {
      setText(
        text.toLowerCase().replace(/(^\s*|\.\s*)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase())
      );
    } else if (type === 'cleanSpaces') {
      setText(text.replace(/\s+/g, ' ').trim());
    }
    addToast('Text transformed successfully!', 'success');
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    addToast('Text copied to clipboard!', 'success');
  };

  const handleClear = () => {
    setText('');
    addToast('Text cleared.', 'info');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-lg text-center">
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Words
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {wordCount}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-lg text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Characters (Spaces)
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {charCountWithSpaces}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-lg text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Chars (No Spaces)
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {charCountNoSpaces}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-lg text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Sentences
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {sentenceCount}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-lg text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Paragraphs
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {paragraphCount}
          </p>
        </div>
      </div>

      {/* Reading / Speaking Estimation */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-800 gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Estimated Reading Time: <strong>{readingTimeMinutes} min</strong> (~200 wpm)</span>
        </div>
        <div className="flex items-center gap-2">
          <AlignLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Estimated Speaking Time: <strong>{speakingTimeMinutes} min</strong> (~130 wpm)</span>
        </div>
      </div>

      {/* Text Area Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Enter or Paste Text
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to analyze words, characters, and reading time..."
          rows={8}
          className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
        />
      </div>

      {/* Transformation Tools */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Text Case Converters
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyTransform('upper')}
            className="py-1.5 px-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            UPPERCASE
          </button>
          <button
            onClick={() => applyTransform('lower')}
            className="py-1.5 px-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            lowercase
          </button>
          <button
            onClick={() => applyTransform('title')}
            className="py-1.5 px-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            Title Case
          </button>
          <button
            onClick={() => applyTransform('sentence')}
            className="py-1.5 px-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            Sentence case
          </button>
          <button
            onClick={() => applyTransform('cleanSpaces')}
            className="py-1.5 px-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            Remove Extra Spaces
          </button>
        </div>
      </div>

      {/* Top Keywords Analysis */}
      {sortedKeywords.length > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Top Keyword Frequency Density
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {sortedKeywords.map(([kw, count]) => {
              const density = Math.round((count / wordCount) * 100);
              return (
                <div
                  key={kw}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 rounded-lg text-center"
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white block line-clamp-1">
                    "{kw}"
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {count}x ({density}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
