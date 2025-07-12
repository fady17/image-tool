// src/components/image-editor/ControlPanel.tsx
import { useImageStore } from '../../store/useImageStore';
import { Slider } from '../ui/Slider';
import { useCallback } from 'react';
import type { ExportOptions } from '../../../types';

const formatLabels: Record<string, string> = { 
  jpeg: 'JPEG', 
  png: 'PNG', 
  webp: 'WebP', 
  avif: 'AVIF' 
};

export function ControlPanel() {
  const {
    originalFile,
    exportOptions,
    processedImage,
    isProcessing,
    setExportOption,
    convertAndProcess,
    resetProcessing,
  } = useImageStore();

  const handleDownload = useCallback(() => {
    if (!processedImage) {
      alert("No processed image to download. Please process an image first.");
      return;
    }
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `compressed-image.${exportOptions.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedImage, exportOptions.format]);

  const handleReset = useCallback(() => {
    resetProcessing();
  }, [resetProcessing]);

  const supportsQuality = ['jpeg', 'webp', 'avif'].includes(exportOptions.format);
  const hasOriginalFile = !!originalFile;
  const canProcess = hasOriginalFile && !isProcessing;
  const canDownload = !!processedImage && !isProcessing;

  return (
    <aside className="bg-gray-800/50 p-6 rounded-lg flex flex-col gap-6 h-full">
      {/* Export Settings */}
      <div className="flex-grow space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
            Export Settings
          </h3>
          
          <div className="space-y-4">
            {/* Format Selection */}
            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-300 mb-2">
                Output Format
              </label>
              <select 
                id="format" 
                name="format" 
                value={exportOptions.format} 
                onChange={(e) => setExportOption('format', e.target.value as ExportOptions['format'])}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isProcessing}
              >
                {Object.entries(formatLabels).map(([format, label]) => (
                  <option key={format} value={format}>{label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                {exportOptions.format === 'jpeg' && 'Best for photos, smaller file size'}
                {exportOptions.format === 'png' && 'Best for images with transparency'}
                {exportOptions.format === 'webp' && 'Modern format, excellent compression'}
                {exportOptions.format === 'avif' && 'Next-gen format, best compression'}
              </p>
            </div>

            {/* Quality Slider */}
            {supportsQuality && (
              <div>
                <Slider 
                  id="quality" 
                  label="Quality" 
                  min="10" 
                  max="100" 
                  step="5"
                  value={exportOptions.quality}
                  onChange={(e) => setExportOption('quality', parseInt(e.target.value, 10))}
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {exportOptions.quality >= 80 && 'High quality, larger file size'}
                  {exportOptions.quality >= 50 && exportOptions.quality < 80 && 'Good quality, balanced size'}
                  {exportOptions.quality < 50 && 'Lower quality, smaller file size'}
                </p>
              </div>
            )}

            {/* Max Dimension */}
            <div>
              <label htmlFor="maxDimension" className="block text-sm font-medium text-gray-300 mb-2">
                Max Dimension (pixels)
              </label>
              <select
                id="maxDimension"
                value={exportOptions.maxDimension}
                onChange={(e) => setExportOption('maxDimension', parseInt(e.target.value, 10))}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isProcessing}
              >
                <option value={1920}>1920px (Full HD)</option>
                <option value={1600}>1600px (Large)</option>
                <option value={1280}>1280px (Medium)</option>
                <option value={800}>800px (Small)</option>
              </select>
            </div>
          </div>
        </div>

        {/* File Info */}
        {originalFile && (
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Original File</h4>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-400">Name:</span> {originalFile.name}</p>
              <p><span className="text-gray-400">Size:</span> {(originalFile.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><span className="text-gray-400">Type:</span> {originalFile.type}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex-shrink-0 space-y-3">
        <button 
          onClick={convertAndProcess} 
          className={`w-full px-4 py-3 text-base font-medium rounded-md transition-colors ${
            canProcess 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-600 cursor-not-allowed text-gray-300'
          }`}
          disabled={!canProcess}
        >
          {isProcessing ? 'Processing...' : 'Process Image'}
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={handleDownload} 
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              canDownload 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-600 cursor-not-allowed text-gray-300'
            }`}
            disabled={!canDownload}
          >
            Download
          </button>
          
          {processedImage && (
            <button 
              onClick={handleReset} 
              className="flex-1 px-4 py-2 text-sm font-medium bg-gray-600 hover:bg-gray-500 rounded-md transition-colors text-white"
              disabled={isProcessing}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
// // src/components/image-editor/ControlPanel.tsx
// import { useImageStore } from '../../store/useImageStore';
// import { Slider } from '../ui/Slider';
// import { useCallback } from 'react';
// import type { ExportOptions } from '../../../types';

// const formatLabels: Record<string, string> = { jpeg: 'JPEG', png: 'PNG', webp: 'WebP', avif: 'AVIF' };

// export function ControlPanel() {
//   const {
//     exportOptions,
//     processedImage,
//     isProcessing,
//     setExportOption,
//     convertAndProcess, 
//   } = useImageStore();

//   const handleDownload = useCallback(() => {
//     if (!processedImage) {
//       alert("No processed image to download.");
//       return;
//     }
//     const link = document.createElement('a');
//     link.href = processedImage;
//     link.download = `converted-image.${exportOptions.format}`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }, [processedImage, exportOptions.format]);

//   const supportsQuality = ['jpeg', 'webp', 'avif'].includes(exportOptions.format);

//   return (
//     <aside className="bg-gray-800/50 p-6 rounded-lg flex flex-col gap-6 h-full">
//       <div className="flex-grow space-y-6">
//         <div>
//           <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Export Settings</h3>
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="format" className="block text-sm font-medium text-gray-300 mb-1">Format</label>
//               <select id="format" name="format" value={exportOptions.format} 
//                 onChange={(e) => setExportOption('format', e.target.value as ExportOptions['format'])}
//                 className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 {Object.keys(formatLabels).map(format => (<option key={format} value={format}>{formatLabels[format]}</option>))}
//               </select>
//             </div>
//             {supportsQuality && (
//               <Slider 
//                 id="quality" label="Quality" min="1" max="100" value={exportOptions.quality}
//                 onChange={(e) => setExportOption('quality', parseInt(e.target.value, 10))}
//               />
//             )}
//           </div>
//         </div>
//       </div>
      
//       <div className="flex-shrink-0">
//         <div className="flex flex-col gap-3">
//           <button 
//             onClick={convertAndProcess} 
//             className="w-full px-4 py-3 text-base font-medium bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
//             disabled={isProcessing}
//           >
//             {isProcessing ? 'Processing...' : 'Process Image'}
//           </button>
//           <button 
//             onClick={handleDownload} 
//             className="w-full px-4 py-2 text-sm font-medium bg-gray-600 hover:bg-gray-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
//             disabled={!processedImage || isProcessing}
//           >
//             Download Processed Image
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// }