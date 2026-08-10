import React, { useState } from 'react';
import JSZip from 'jszip';
import { useApp } from '../../context/AppContext';
import { Upload, Download, Trash2, ArrowRightLeft, Archive } from 'lucide-react';

interface ConvertedFile {
  id: string;
  name: string;
  originalSize: number;
  jpgSize: number;
  jpgUrl: string;
  blob: Blob;
}

export const PngToJpgConverterTool: React.FC = () => {
  const { addToast } = useApp();
  const [bgColor, setBgColor] = useState('#ffffff');
  const [quality, setQuality] = useState(85);
  const [items, setItems] = useState<ConvertedFile[]>([]);

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
      (f) => f.type === 'image/png' || f.name.match(/\.png$/i)
    );

    if (validFiles.length === 0) {
      addToast('Please upload PNG image files.', 'error');
      return;
    }

    try {
      const results = await Promise.all(
        validFiles.map((file) => {
          return new Promise<ConvertedFile>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('Canvas error');

                // Fill background for transparency
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                canvas.toBlob(
                  (blob) => {
                    if (!blob) return reject('Blob error');
                    const jpgUrl = URL.createObjectURL(blob);
                    resolve({
                      id: Math.random().toString(36).substring(2, 9),
                      name: file.name.replace(/\.[^/.]+$/, ''),
                      originalSize: file.size,
                      jpgSize: blob.size,
                      jpgUrl,
                      blob,
                    });
                  },
                  'image/jpeg',
                  quality / 100
                );
              };
              img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
          });
        })
      );

      setItems((prev) => [...prev, ...results]);
      addToast(`Converted ${results.length} PNG file(s) to JPG!`, 'success');
    } catch (e) {
      addToast('Conversion failed.', 'error');
    }
  };

  const handleDownloadSingle = (item: ConvertedFile) => {
    const a = document.createElement('a');
    a.href = item.jpgUrl;
    a.download = `${item.name}.jpg`;
    a.click();
    addToast('Downloaded JPG file!', 'success');
  };

  const handleDownloadZip = async () => {
    if (items.length === 0) return;
    const zip = new JSZip();
    items.forEach((item) => {
      zip.file(`${item.name}.jpg`, item.blob);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'quicktoolo-converted-jpgs.zip';
    a.click();
    addToast('Downloaded ZIP of all JPG images!', 'success');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Settings bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Background Fill for Transparency
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded-md border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent"
            />
            <span className="font-mono text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">
              {bgColor}
            </span>
            <div className="flex gap-1.5 ml-auto">
              {['#ffffff', '#000000', '#f8fafc'].map((hex) => (
                <button
                  key={hex}
                  onClick={() => setBgColor(hex)}
                  className="w-5 h-5 rounded border border-slate-300 dark:border-slate-700 shadow-sm"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              JPG Quality ({quality}%)
            </label>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      {/* Dropzone */}
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
          accept="image/png"
          onChange={(e) => handleFilesAdded(e.target.files)}
          className="hidden"
          id="png-file-input"
        />
        <label htmlFor="png-file-input" className="cursor-pointer block">
          <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Upload PNG files to Convert to JPG
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Transparent background regions will be automatically filled with solid color
          </p>
        </label>
      </div>

      {/* Results */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Converted JPG Files ({items.length})
            </h4>
            <button
              onClick={handleDownloadZip}
              className="py-2 px-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-blue-200 dark:shadow-none"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Download All (ZIP)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.jpgUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded-md object-cover bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {item.name}.jpg
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      PNG ({formatBytes(item.originalSize)}) → JPG ({formatBytes(item.jpgSize)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownloadSingle(item)}
                    className="p-1.5 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-500"
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
