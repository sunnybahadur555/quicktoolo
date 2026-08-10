import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useApp } from '../../context/AppContext';
import { Upload, Download, Trash2, ArrowUp, ArrowDown, Layers, FileCheck } from 'lucide-react';

interface PdfFileItem {
  id: string;
  file: File;
  pageCount: number;
  size: number;
}

export const PdfMergerTool: React.FC = () => {
  const { addToast } = useApp();
  const [pdfList, setPdfList] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFilesAdded = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter(
      (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf')
    );

    if (validFiles.length === 0) {
      addToast('Please upload valid PDF files.', 'error');
      return;
    }

    try {
      const parsedItems = await Promise.all(
        validFiles.map(async (file) => {
          const buffer = await file.arrayBuffer();
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          return {
            id: Math.random().toString(36).substring(2, 9),
            file,
            pageCount: doc.getPageCount(),
            size: file.size,
          };
        })
      );

      setPdfList((prev) => [...prev, ...parsedItems]);
      addToast(`Added ${parsedItems.length} PDF file(s).`, 'success');
    } catch (e) {
      addToast('Failed to parse some PDF files. Ensure they are not password protected.', 'error');
    }
  };

  const movePdf = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === pdfList.length - 1)) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    const updated = [...pdfList];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setPdfList(updated);
  };

  const removePdf = (id: string) => {
    setPdfList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleMerge = async () => {
    if (pdfList.length < 2) {
      addToast('Please add at least 2 PDF files to merge.', 'info');
      return;
    }

    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfList) {
        const buffer = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `merged-toolvex-${Date.now()}.pdf`;
      a.click();

      addToast('PDF files merged and downloaded successfully!', 'success');
    } catch (e) {
      console.error(e);
      addToast('Error merging PDF files.', 'error');
    } finally {
      setIsMerging(false);
    }
  };

  const totalPages = pdfList.reduce((sum, p) => sum + p.pageCount, 0);
  const totalSize = pdfList.reduce((sum, p) => sum + p.size, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFilesAdded(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-8 text-center transition-colors cursor-pointer group"
      >
        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={(e) => handleFilesAdded(e.target.files)}
          className="hidden"
          id="pdf-merge-input"
        />
        <label htmlFor="pdf-merge-input" className="cursor-pointer block">
          <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Upload PDF Files to Merge
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drag & drop two or more PDF documents. 100% Client-side privacy.
          </p>
        </label>
      </div>

      {/* PDF List */}
      {pdfList.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 gap-2 text-xs">
            <div className="font-bold text-slate-900 dark:text-white">
              {pdfList.length} Files Selected ({totalPages} Total Pages, {formatBytes(totalSize)})
            </div>
            <span className="text-slate-500">Reorder files before merging</span>
          </div>

          <div className="space-y-3">
            {pdfList.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded bg-rose-50 dark:bg-slate-700 text-rose-600 dark:text-rose-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                    PDF
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {item.file.name}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.pageCount} Pages • {formatBytes(item.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => movePdf(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => movePdf(index, 'down')}
                    disabled={index === pdfList.length - 1}
                    className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removePdf(item.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleMerge}
            disabled={isMerging || pdfList.length < 2}
            className="w-full py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isMerging ? 'Merging PDF Files...' : `Merge ${pdfList.length} PDF Documents`}</span>
          </button>
        </div>
      )}
    </div>
  );
};
