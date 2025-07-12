// src/components/image-editor/ImageCanvas.tsx
import { useImageStore } from '../../store/useImageStore';

export function ImageCanvas() {
  const originalImageUrl = useImageStore((state) => state.originalImageUrl);
  const processedImage = useImageStore((state) => state.processedImage);
  const error = useImageStore((state) => state.error);
  const isProcessing = useImageStore((state) => state.isProcessing);
  const processingProgress = useImageStore((state) => state.processingProgress);
  const processingMessage = useImageStore((state) => state.processingMessage);
  const processingMetadata = useImageStore((state) => state.processingMetadata);

  // Show processed image if available, otherwise show original
  const displayImage = processedImage || originalImageUrl;
  const isShowingProcessed = !!processedImage;

  return (
    <div className="w-full h-full bg-black/50 rounded-lg p-4 flex flex-col">
      {/* Image Display Area */}
      <div className="flex-1 relative min-h-[400px] flex items-center justify-center">
        {displayImage && !error ? (
          <div className="relative w-full h-full">
            <img
              src={displayImage}
              alt="Image preview"
              className={`w-full h-full object-contain transition-all duration-300 ${
                isProcessing ? 'opacity-50 blur-sm' : 'opacity-100'
              }`}
            /> 
            
            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-lg">
                <div className="bg-gray-900/90 p-6 rounded-lg flex flex-col items-center space-y-4">
                  {/* Spinner */}
                  <svg className="animate-spin h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  
                  {/* Progress Bar */}
                  <div className="w-64 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${processingProgress}%` }}
                    ></div>
                  </div>
                  
                  {/* Progress Text */}
                  <div className="text-center">
                    <p className="text-white font-medium">{processingMessage}</p>
                    <p className="text-gray-400 text-sm">{processingProgress}% complete</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Image Status Badge */}
            {!isProcessing && (
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isShowingProcessed 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {isShowingProcessed ? 'Processed' : 'Original'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center text-gray-500 p-4">
            {error ? (
              <div className="text-red-400 max-w-md">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="font-semibold text-lg mb-2">Processing Error</p>
                <p className="text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  {error}
                </p>
              </div>
            ) : (
              <div className="text-gray-400">
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-lg">Upload an image to get started</p>
                <p className="text-sm mt-2">Your image will appear here for processing</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Processing Metadata */}
      {processingMetadata && !isProcessing && (
        <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Processing Results</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Dimensions:</span>
              <p className="text-white">{processingMetadata.width} × {processingMetadata.height}</p>
            </div>
            <div>
              <span className="text-gray-400">Original Size:</span>
              <p className="text-white">{(processingMetadata.originalSize / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div>
              <span className="text-gray-400">Compressed Size:</span>
              <p className="text-white">{(processingMetadata.compressedSize / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div>
              <span className="text-gray-400">Compression:</span>
              <p className={`font-medium ${
                processingMetadata.compressionRatio > 50 ? 'text-green-400' : 
                processingMetadata.compressionRatio > 25 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {processingMetadata.compressionRatio}% saved
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// // src/components/image-editor/ImageCanvas.tsx
// import { useImageStore } from '../../store/useImageStore';

// export function ImageCanvas() {
//   // We will display the processedImage if it exists, otherwise fall back to the original.
//   const imageUrl = useImageStore((state) => state.processedImage || state.originalImageUrl);
//   const error = useImageStore((state) => state.error);
//   const isProcessing = useImageStore((state) => state.isProcessing);

//   return (
//     <div className="w-full h-full bg-black/50 rounded-lg p-4 flex items-center justify-center">
//       <div className="relative w-full h-full min-h-[400px]">
//         {imageUrl && !error ? (
//           <img
//             src={imageUrl}
//             alt="Image preview"
//             // The image is slightly transparent while processing as a visual cue.
//             className={`w-full h-full object-contain transition-opacity duration-200 ${isProcessing ? 'opacity-50' : 'opacity-100'}`}
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-center text-gray-500 p-4">
//             {error ? (
//               <div className="text-red-400">
//                 <p className="font-semibold">Error</p>
//                 <p className="text-sm">{error}</p>
//               </div>
//             ) : (
//               <p>Image preview will appear here.</p>
//             )}
//           </div>
//         )}
        
//         {/* Loading Spinner Overlay */}
//         {isProcessing && (
//           <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center rounded-lg">
//             <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }