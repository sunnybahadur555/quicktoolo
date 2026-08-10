import React, { useState } from 'react';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { useApp } from '../../context/AppContext';
import { Upload, Download, Trash2, ArrowUp, ArrowDown, FileSpreadsheet, FileCheck } from 'lucide-react';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export const ImageToPdfConverterTool: React.FC = () => {
  const { addToast } = useApp();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('auto');
  const [margin, setMargin] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));

    if (validFiles.length === 0) {
      addToast('Please upload valid image files (JPG, PNG, WEBP).', 'error');
      return;
    }

    const newItems: ImageItem[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newItems]);
    addToast(`Added ${newItems.length} image(s).`, 'success');
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === images.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);
  };

  const removeItem = (id: string) => {
    setImages((prev) => prev.filter((item) => item.id !== id));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        let embeddedImage;

        if (item.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // Default to JPG for JPEG, WEBP fallback by drawing to canvas
          try {
            embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
          } catch {
            // Fallback convert to PNG blob via canvas
            const blob = await new Promise<Blob>((resolve) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                canvas.toBlob((b) => resolve(b!), 'image/png');
              };
              img.src = item.previewUrl;
            });
            const pngBuffer = await blob.arrayBuffer();
            embeddedImage = await pdfDoc.embedPng(pngBuffer);
          }
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth = PageSizes.A4[0];
        let pageHeight = PageSizes.A4[1];

        if (pageSize === 'fit') {
          pageWidth = imgWidth + margin * 2;
          pageHeight = imgHeight + margin * 2;
        } else {
          if (orientation === 'landscape' || (orientation === 'auto' && imgWidth > imgHeight)) {
            pageWidth = PageSizes.A4[1];
            pageHeight = PageSizes.A4[0];
          }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        const availWidth = pageWidth - margin * 2;
        const availHeight = pageHeight - margin * 2;

        const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);
        const finalW = imgWidth * scale;
        const finalH = imgHeight * scale;

        const x = (pageWidth - finalW) / 2;
        const y = (pageHeight - finalH) / 2;

        page.drawImage(embeddedImage, {
          x,
          y,
          width: finalW,
          height: finalH,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `quicktoolo-images-${Date.now()}.pdf`;
      a.click();

      addToast('PDF Document generated and downloaded successfully!', 'success');
    } catch (e) {
      console.error(e);
      addToast('Error generating PDF file.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Settings bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Page Size
          </label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as any)}
            className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
          >
            <option value="a4">Standard A4 Page</option>
            <option value="fit">Fit Image Dimensions Exactly</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Page Orientation
          </label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as any)}
            className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
          >
            <option value="auto">Auto (Detect per image)</option>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Page Margin
          </label>
          <select
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-900 dark:text-white"
          >
            <option value="0">No Margin (Full Bleed)</option>
            <option value="20">Small Margin (20px)</option>
            <option value="40">Medium Margin (40px)</option>
          </select>
        </div>
      </div>

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
          accept="image/*"
          onChange={(e) => handleFilesAdded(e.target.files)}
          className="hidden"
          id="img2pdf-file-input"
        />
        <label htmlFor="img2pdf-file-input" className="cursor-pointer block">
          <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Upload Images to Convert into PDF
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drag & drop JPG, PNG, or WebP pictures. Reorder pages below.
          </p>
        </label>
      </div>

      {/* Reorderable Page List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              PDF Pages ({images.length})
            </h4>
            <span className="text-xs text-slate-500">Use arrows to reorder pages</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 flex flex-col items-center group"
              >
                <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Page {index + 1}
                </div>
                <img
                  src={img.previewUrl}
                  alt={img.file.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-1 w-full text-center px-1">
                  {img.file.name}
                </p>

                <div className="flex items-center justify-center gap-1 mt-2">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === images.length - 1}
                    className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeItem(img.id)}
                    className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-rose-500 hover:text-white text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={generatePdf}
            disabled={isGenerating}
            className="w-full py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Generating PDF Document...' : 'Convert Images to PDF'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
