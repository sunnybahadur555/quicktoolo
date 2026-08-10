import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Code, Copy, Download, Trash2, CheckCircle2, AlertCircle, FileCode, Play } from 'lucide-react';

export const JsonFormatterTool: React.FC = () => {
  const { addToast } = useApp();
  const [inputJson, setInputJson] = useState<string>(
    JSON.stringify(
      {
        siteName: 'QuickToolo',
        url: 'https://quicktoolo.app',
        isFree: true,
        tools: ['QR Code Generator', 'Image Compressor', 'JSON Formatter', 'PDF Merger'],
        stats: { totalUsers: 100000, rating: 4.9 },
      },
      null,
      2
    )
  );

  const [indentSize, setIndentSize] = useState<number | string>(2);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);

  const sampleJson = {
    project: 'QuickToolo Platform',
    version: '1.0.0',
    features: {
      privacy: '100% Client-Side',
      cost: 'Free Forever',
      speed: 'Instant Browser Processing',
    },
    activeToolsCount: 10,
    tags: ['developer-tools', 'image-tools', 'pdf-tools'],
  };

  const handleFormat = () => {
    if (!inputJson.trim()) {
      setErrorMessage(null);
      setIsValid(true);
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const indent = indentSize === 'tab' ? '\t' : Number(indentSize);
      const formatted = JSON.stringify(parsed, null, indent);
      setInputJson(formatted);
      setErrorMessage(null);
      setIsValid(true);
      addToast('JSON formatted and beautified!', 'success');
    } catch (err: any) {
      setIsValid(false);
      setErrorMessage(err.message || 'Invalid JSON syntax');
      addToast('Invalid JSON syntax. See error diagnostics.', 'error');
    }
  };

  const handleMinify = () => {
    if (!inputJson.trim()) return;

    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setInputJson(minified);
      setErrorMessage(null);
      setIsValid(true);
      addToast('JSON minified into compact single line!', 'success');
    } catch (err: any) {
      setIsValid(false);
      setErrorMessage(err.message || 'Invalid JSON syntax');
      addToast('Invalid JSON syntax.', 'error');
    }
  };

  const handleValidate = () => {
    if (!inputJson.trim()) return;
    try {
      JSON.parse(inputJson);
      setErrorMessage(null);
      setIsValid(true);
      addToast('JSON is 100% Valid!', 'success');
    } catch (err: any) {
      setIsValid(false);
      setErrorMessage(err.message || 'Invalid JSON syntax');
      addToast('JSON contains syntax errors.', 'error');
    }
  };

  const handleLoadSample = () => {
    setInputJson(JSON.stringify(sampleJson, null, 2));
    setErrorMessage(null);
    setIsValid(true);
    addToast('Sample JSON loaded.', 'info');
  };

  const handleCopy = () => {
    if (!inputJson) return;
    navigator.clipboard.writeText(inputJson);
    addToast('JSON copied to clipboard!', 'success');
  };

  const handleDownload = () => {
    if (!inputJson) return;
    const blob = new Blob([inputJson], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'quicktoolo-formatted.json';
    a.click();
    addToast('Downloaded JSON file!', 'success');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFormat}
            className="py-2 px-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-200 dark:shadow-none flex items-center gap-1.5 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Format / Beautify</span>
          </button>

          <button
            onClick={handleMinify}
            className="py-2 px-3.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            Minify JSON
          </button>

          <button
            onClick={handleValidate}
            className="py-2 px-3.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            Validate
          </button>

          <select
            value={indentSize}
            onChange={(e) => setIndentSize(e.target.value)}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value={2}>2 Spaces Indent</option>
            <option value={4}>4 Spaces Indent</option>
            <option value="tab">Tab Indent</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSample}
            className="py-1.5 px-3 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60"
          >
            Load Sample
          </button>
          <button
            onClick={handleCopy}
            className="p-2 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      {/* Syntax Validation Status Indicator */}
      {errorMessage ? (
        <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-lg text-rose-700 dark:text-rose-300 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span><strong>JSON Syntax Error:</strong> {errorMessage}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>JSON Syntax Valid</span>
        </div>
      )}

      {/* Editor Box */}
      <div>
        <textarea
          value={inputJson}
          onChange={(e) => {
            setInputJson(e.target.value);
            try {
              JSON.parse(e.target.value);
              setErrorMessage(null);
              setIsValid(true);
            } catch (err: any) {
              setIsValid(false);
              setErrorMessage(err.message);
            }
          }}
          placeholder="Paste or write JSON here..."
          rows={16}
          className="w-full p-4 bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed border border-slate-800 selection:bg-blue-500 selection:text-white"
        />
      </div>
    </div>
  );
};
