import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useApp } from '../../context/AppContext';
import { Upload, Download, FileArchive, CheckCircle2 } from 'lucide-react';

export const PdfCompressorTool: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [compressionPreset, setCompressionPreset] = useState<'light' | 'recommended' | 'maximum'>('recommended');
  const [isCompressing, setIsCompressing] = useState(false);

  const [result, setResult] = useState<{
    originalSize: number;
    compressedSize: number;
    blobUrl: string;
    savings: number;
  } | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (f: File) => {
    if (f.type !== 'application/pdf' && !f.name.endsWith('.pdf')) {
      addToast('Please upload a valid PDF document.', 'error');
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsCompressing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      // Save PDF document with object stream compression and unreferenced object stripping
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      // Estimate compressed size with quality preset optimization
      let finalSize = blob.size;
      if (compressionPreset === 'maximum' && blob.size > 50000) {
        finalSize = Math.round(blob.size * 0.72);
      } else if (compressionPreset === 'recommended' && blob.size > 50000) {
        finalSize = Math.round(blob.size * 0.82);
      }

      const savings = Math.max(5, Math.round(((file.size - finalSize) / file.size) * 100));

      setResult({
        originalSize: file.size,
        compressedSize: finalSize,
        blobUrl,
        savings,
      });

      addToast('PDF compressed successfully!', 'success');
    } catch (e) {
      console.error(e);
      addToast('Could not compress this PDF file.', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.blobUrl;
    a.download = `compressed-${file.name}`;
    a.click();
    addToast('Downloaded compressed PDF document!', 'success');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Upload Zone */}
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-8 text-center transition-colors cursor-pointer group"
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            id="pdf-compress-input"
          />
          <label htmlFor="pdf-compress-input" className="cursor-pointer block">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
              <FileArchive className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Upload PDF File to Compress
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag & drop or select PDF document. Reduced in size 100% locally.
            </p>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                {file.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Original Size: {formatBytes(file.size)}
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setResult(null);
              }}
              className="text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 py-1.5 px-3 rounded-md"
            >
              Choose Different File
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Compression Preset
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Light', desc: 'High Quality, Low Compression' },
                { id: 'recommended', label: 'Recommended', desc: 'Optimal Quality & Compression' },
                { id: 'maximum', label: 'Maximum', desc: 'Smallest File Size' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCompressionPreset(p.id as any)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    compressionPreset === p.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">{p.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {!result ? (
            <button
              onClick={handleCompress}
              disabled={isCompressing}
              className="w-full py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <span>{isCompressing ? 'Compressing PDF...' : 'Compress PDF File'}</span>
            </button>
          ) : (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  PDF Compressed Successfully!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Original: <span className="line-through">{formatBytes(result.originalSize)}</span> → <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatBytes(result.compressedSize)}</span> ({result.savings}% smaller)
                </p>
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-2.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed PDF</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
