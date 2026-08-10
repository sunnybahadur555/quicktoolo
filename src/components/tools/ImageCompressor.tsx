import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { useApp } from '../../context/AppContext';
import { Upload, Download, Trash2, Image as ImageIcon, Archive, CheckCircle2 } from 'lucide-react';

interface CompressedItem {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  blob: Blob;
  savingsPercent: number;
}

export const ImageCompressorTool: React.FC = () => {
  const { addToast } = useApp();
  const [quality, setQuality] = useState<number>(75);
  const [outputFormat, setOutputFormat] = useState<'original' | 'image/jpeg' | 'image/webp'>('original');
  const [isProcessing, setIsProcessing] = useState(false);
  const [items, setItems] = useState<CompressedItem[]>([]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = (file: File, currentQuality: number, targetFormat: string): Promise<CompressedItem> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Failed to create canvas context');

          // Draw image
          if (file.type === 'image/png' && targetFormat === 'image/jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);

          const mimeType = targetFormat === 'original' ? file.type : targetFormat;
          const q = currentQuality / 100;

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject('Compression failed');
              const compressedUrl = URL.createObjectURL(blob);
              const originalUrl = e.target?.result as string;
              const savings = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));

              resolve({
                id: Math.random().toString(36).substring(2, 9),
                name: file.name,
                originalSize: file.size,
                compressedSize: blob.size,
                originalUrl,
                compressedUrl,
                blob,
                savingsPercent: savings,
              });
            },
            mimeType,
            q
          );
        };
        img.onerror = () => reject('Invalid image file');
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFilesAdded = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      addToast('Please upload valid image files (JPG, PNG, WEBP).', 'error');
      setIsProcessing(false);
      return;
    }

    try {
      const results = await Promise.all(
        validFiles.map((file) => processFile(file, quality, outputFormat))
      );
      setItems((prev) => [...prev, ...results]);
      addToast(`Compressed ${results.length} image(s) successfully!`, 'success');
    } catch (err) {
      addToast('Failed to compress some images.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFilesAdded(e.dataTransfer.files);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDownloadSingle = (item: CompressedItem) => {
    const a = document.createElement('a');
    a.href = item.compressedUrl;
    const nameExt = outputFormat === 'image/jpeg' ? '.jpg' : outputFormat === 'image/webp' ? '.webp' : '';
    a.download = `compressed-${item.name}${nameExt}`;
    a.click();
    addToast('Downloaded compressed image!', 'success');
  };

  const handleDownloadAllZip = async () => {
    if (items.length === 0) return;
    const zip = new JSZip();
    items.forEach((item, index) => {
      const ext = item.blob.type === 'image/webp' ? '.webp' : item.blob.type === 'image/jpeg' ? '.jpg' : '.png';
      zip.file(`compressed-${index + 1}-${item.name}${ext}`, item.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'quicktoolo-compressed-images.zip';
    a.click();
    addToast('Downloaded all compressed images in ZIP archive!', 'success');
  };

  const totalOriginal = items.reduce((acc, i) => acc + i.originalSize, 0);
  const totalCompressed = items.reduce((acc, i) => acc + i.compressedSize, 0);
  const totalSavings = totalOriginal > 0 ? Math.max(0, Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-8 text-center transition-colors cursor-pointer group"
      >
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => handleFilesAdded(e.target.files)}
          className="hidden"
          id="compressor-file-input"
        />
        <label htmlFor="compressor-file-input" className="cursor-pointer block">
          <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Drag & Drop images here, or <span className="text-blue-600 dark:text-blue-400 underline">Browse Files</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supports JPG, JPEG, PNG, and WebP
          </p>
        </label>
      </div>

      {/* Settings Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Compression Quality ({quality}%)
            </label>
            <span className="text-xs text-slate-500">
              {quality > 80 ? 'High Quality' : quality > 50 ? 'Balanced' : 'High Compression'}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Output Format
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as any)}
            className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
          >
            <option value="original">Keep Original Format</option>
            <option value="image/jpeg">Convert to JPG / JPEG</option>
            <option value="image/webp">Convert to WebP (Best Compression)</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Compressed {items.length} file(s)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Total Size: <span className="line-through">{formatBytes(totalOriginal)}</span> → <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatBytes(totalCompressed)}</span> ({totalSavings}% smaller)
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadAllZip}
              className="w-full sm:w-auto py-2 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Download All as ZIP</span>
            </button>
          </div>

          {/* Compressed Items List */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-lg gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.compressedUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded-md object-cover bg-slate-100 dark:bg-slate-900 shrink-0"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                      {item.name}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{formatBytes(item.originalSize)}</span>
                      <span>→</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formatBytes(item.compressedSize)}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                        -{item.savingsPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleDownloadSingle(item)}
                    className="py-1.5 px-3 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
