import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, Download, Lock, Unlock, Maximize2, RefreshCw } from 'lucide-react';

export const ImageResizerTool: React.FC = () => {
  const { addToast } = useApp();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState('resized-image');
  const [fileType, setFileType] = useState('image/png');

  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);

  const [width, setWidth] = useState<number | ''>(800);
  const [height, setHeight] = useState<number | ''>(600);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [outputFormat, setOutputFormat] = useState('image/png');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload a valid image file.', 'error');
      return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setOrigWidth(img.width);
        setOrigHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
        setImageSrc(src);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (valStr: string) => {
    if (valStr === '') {
      setWidth('');
      if (lockAspectRatio) {
        setHeight('');
      }
      return;
    }
    const parsed = parseInt(valStr, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setWidth('');
      if (lockAspectRatio) {
        setHeight('');
      }
      return;
    }
    setWidth(parsed);
    if (lockAspectRatio && aspectRatio > 0) {
      setHeight(Math.max(1, Math.round(parsed / aspectRatio)));
    }
  };

  const handleHeightChange = (valStr: string) => {
    if (valStr === '') {
      setHeight('');
      if (lockAspectRatio) {
        setWidth('');
      }
      return;
    }
    const parsed = parseInt(valStr, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setHeight('');
      if (lockAspectRatio) {
        setWidth('');
      }
      return;
    }
    setHeight(parsed);
    if (lockAspectRatio && aspectRatio > 0) {
      setWidth(Math.max(1, Math.round(parsed * aspectRatio)));
    }
  };

  const handleWidthBlur = () => {
    if (width === '' || width < 1) {
      const fallbackW = 1;
      setWidth(fallbackW);
      if (lockAspectRatio && aspectRatio > 0) {
        setHeight(Math.max(1, Math.round(fallbackW / aspectRatio)));
      }
    }
  };

  const handleHeightBlur = () => {
    if (height === '' || height < 1) {
      const fallbackH = 1;
      setHeight(fallbackH);
      if (lockAspectRatio && aspectRatio > 0) {
        setWidth(Math.max(1, Math.round(fallbackH * aspectRatio)));
      }
    }
  };

  const handlePresetPercentage = (percent: number) => {
    if (origWidth === 0) return;
    const newW = Math.max(1, Math.round((origWidth * percent) / 100));
    const newH = Math.max(1, Math.round((origHeight * percent) / 100));
    setWidth(newW);
    setHeight(newH);
  };

  useEffect(() => {
    const numW = typeof width === 'number' ? width : parseInt(String(width), 10);
    const numH = typeof height === 'number' ? height : parseInt(String(height), 10);

    if (!imageSrc || isNaN(numW) || isNaN(numH) || numW < 1 || numH < 1) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = numW;
      canvas.height = numH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, numW, numH);
      }

      ctx.drawImage(img, 0, 0, numW, numH);
      setPreviewUrl(canvas.toDataURL(outputFormat, 0.92));
    };
    img.src = imageSrc;
  }, [imageSrc, width, height, outputFormat]);

  const handleDownload = () => {
    const numW = typeof width === 'number' && width >= 1 ? width : 1;
    const numH = typeof height === 'number' && height >= 1 ? height : 1;

    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    const ext = outputFormat === 'image/jpeg' ? '.jpg' : outputFormat === 'image/webp' ? '.webp' : '.png';
    a.download = `${fileName}-resized-${numW}x${numH}${ext}`;
    a.click();
    addToast('Resized image downloaded!', 'success');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
      {!imageSrc ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-12 text-center transition-colors cursor-pointer group"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            className="hidden"
            id="resizer-file-input"
          />
          <label htmlFor="resizer-file-input" className="cursor-pointer block">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Upload Image to Resize
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag & drop or click to select JPG, PNG, or WebP photo
            </p>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase text-slate-500">Original Dimensions</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {origWidth} × {origHeight} px
                </p>
              </div>
              <button
                onClick={() => setImageSrc(null)}
                className="py-1 px-2.5 rounded-md text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
              >
                Change Image
              </button>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Quick Scale Presets
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 200].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handlePresetPercentage(pct)}
                    className="py-2 px-3 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Dimensions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Target Dimensions (Pixels)
                </label>
                <button
                  onClick={() => {
                    const nextLock = !lockAspectRatio;
                    setLockAspectRatio(nextLock);
                    if (nextLock && typeof width === 'number' && typeof height === 'number' && width > 0 && height > 0) {
                      setAspectRatio(width / height);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                    lockAspectRatio
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{lockAspectRatio ? 'Ratio Locked' : 'Ratio Unlocked'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Width"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    onBlur={handleWidthBlur}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Height"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    onBlur={handleHeightBlur}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Export Format
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="image/png">PNG Format</option>
                <option value="image/jpeg">JPG / JPEG Format</option>
                <option value="image/webp">WebP Format</option>
              </select>
            </div>
          </div>

          {/* Preview & Download */}
          <div className="lg:col-span-6 flex flex-col items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-lg">
            <div className="text-center w-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Resized Preview
                </span>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full">
                  {width || '—'} × {height || '—'} px
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 max-h-80 overflow-hidden flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Resized preview"
                    className="max-h-72 object-contain rounded-md"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-slate-400 text-xs">
                    <span>Rendering preview...</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full mt-6 py-3 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Resized Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
