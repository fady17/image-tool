// src/workers/image.worker.ts
import imageCompression from 'browser-image-compression';
import type { ExportOptions } from '../../types';

self.onmessage = async (e: MessageEvent) => {
  const { file, exportOptions } = e.data as {
    file: File;
    exportOptions: ExportOptions;
  };

  try {
    const startTime = performance.now();
    
    // Send progress update
    self.postMessage({ type: 'progress', message: 'Starting compression...', progress: 10 });

    // Simplified compression logic - let the library handle most of the work
    const quality = exportOptions.quality / 100;
    
    // Calculate reasonable target size (more conservative approach)
    const originalSizeMB = file.size / (1024 * 1024);
    const targetSizeMB = Math.max(0.1, originalSizeMB * 0.7); // More aggressive default
    
    const compressionOptions = {
      maxSizeMB: targetSizeMB,
      maxWidthOrHeight: exportOptions.maxDimension || 1920,
      initialQuality: quality,
      useWebWorker: false,
      fileType: `image/${exportOptions.format}`,
      alwaysKeepResolution: false, // Allow resolution reduction for better compression
    };

    console.log('[Worker] Compressing with options:', compressionOptions);
    
    self.postMessage({ type: 'progress', message: 'Compressing image...', progress: 50 });
    
    let compressedFile;
    
    // Try library compression first
    try {
      compressedFile = await imageCompression(file, compressionOptions);
      console.log('[Worker] Library compression successful');
    } catch (libError) {
      console.log('[Worker] Library compression failed, trying manual approach:', libError);
      
      // Fallback to manual canvas compression
      self.postMessage({ type: 'progress', message: 'Applying manual compression...', progress: 70 });
      
      compressedFile = await manualCompression(file, exportOptions);
    }
    
    self.postMessage({ type: 'progress', message: 'Finalizing...', progress: 90 });
    
    const processingTime = performance.now() - startTime;
    const dataUrl = await imageCompression.getDataUrlFromFile(compressedFile);
    
    // Get final dimensions
    const image = await createImageBitmap(compressedFile);
    
    // Calculate compression ratio
    const compressionRatio = ((file.size - compressedFile.size) / file.size) * 100;

    self.postMessage({
      type: 'done',
      dataUrl,
      metadata: {
        width: image.width,
        height: image.height,
        processingTime: Math.round(processingTime),
        originalSize: file.size,
        compressedSize: compressedFile.size,
        compressionRatio: Math.round(compressionRatio),
      },
    });
    
  } catch (error) {
    console.error('[Worker] Compression failed:', error);
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown worker error',
    });
  }
};

// Manual compression using canvas
async function manualCompression(file: File, exportOptions: ExportOptions): Promise<File> {
  const canvas = await createCanvasFromFile(file);
  const quality = exportOptions.quality / 100;
  
  // Apply dimension reduction based on quality
  let finalCanvas = canvas;
  if (exportOptions.quality < 70) {
    const scaleFactor = Math.max(0.5, exportOptions.quality / 100);
    const newWidth = Math.floor(canvas.width * scaleFactor);
    const newHeight = Math.floor(canvas.height * scaleFactor);
    
    finalCanvas = new OffscreenCanvas(newWidth, newHeight);
    const ctx = finalCanvas.getContext('2d')!;
    ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
  }
  
  const blob = await finalCanvas.convertToBlob({
    type: `image/${exportOptions.format}`,
    quality: quality,
  });
  
  return new File([blob], file.name, { type: blob.type });
}

// Helper function to create canvas from file
async function createCanvasFromFile(file: File): Promise<OffscreenCanvas> {
  const imageBitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(imageBitmap, 0, 0);
  return canvas;
}
// // src/workers/image.worker.ts
// import imageCompression from 'browser-image-compression';
// import type { ExportOptions } from '../../types';

// self.onmessage = async (e: MessageEvent) => {
//   const { file, exportOptions } = e.data as {
//     file: File;
//     exportOptions: ExportOptions;
//   };

//   try {
//     const startTime = performance.now();

//     // Calculate target file size based on original file size and quality
//     const originalSizeMB = file.size / (1024 * 1024);
//     const targetSizeMB = Math.max(0.1, originalSizeMB * (exportOptions.quality / 100));
    
//     // The library wants quality as a value between 0 and 1
//     const quality = exportOptions.quality / 100;

//     const compressionOptions = {
//       // Use a reasonable max size based on quality setting
//       maxSizeMB: targetSizeMB,
      
//       // Set max dimensions to prevent unnecessarily large images
//       maxWidthOrHeight: exportOptions.maxDimension || 1920,
      
//       // Use explicit quality control
//       initialQuality: quality,
      
//       // Disable internal web worker since we're already in one
//       useWebWorker: false,
      
//       // Explicit file type for better control
//       fileType: `image/${exportOptions.format}`,
      
//       // Preserve or reduce resolution based on quality
//       alwaysKeepResolution: exportOptions.quality > 70,
      
//       // More aggressive compression for lower quality settings
//       ...(exportOptions.quality < 50 && {
//         maxIteration: 15,
//         exifOrientation: 1,
//       }),
//     };

//     console.log('[Worker] Compressing with options:', compressionOptions);
    
//     let compressedFile = await imageCompression(file, compressionOptions);
    
//     // If we're still not getting good compression, try manual approach
//     if (compressedFile.size > targetSizeMB * 1024 * 1024 && exportOptions.quality < 80) {
//       console.log('[Worker] First compression insufficient, trying manual approach...');
      
//       // Create canvas for manual compression
//       const canvas = await createCanvasFromFile(file);
      
//       // Apply quality-based dimension reduction
//       if (exportOptions.quality < 60) {
//         const scaleFactor = 0.8;
//         const newWidth = Math.floor(canvas.width * scaleFactor);
//         const newHeight = Math.floor(canvas.height * scaleFactor);
        
//         const scaledCanvas = new OffscreenCanvas(newWidth, newHeight);
//         const scaledCtx = scaledCanvas.getContext('2d')!;
//         scaledCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
        
//         const blob = await scaledCanvas.convertToBlob({
//           type: `image/${exportOptions.format}`,
//           quality: quality,
//         });
        
//         compressedFile = new File([blob], file.name, { type: blob.type });
//       } else {
//         // Just recompress with canvas
//         const blob = await canvas.convertToBlob({
//           type: `image/${exportOptions.format}`,
//           quality: quality,
//         });
        
//         compressedFile = new File([blob], file.name, { type: blob.type });
//       }
//     }

//     const processingTime = performance.now() - startTime;
//     const dataUrl = await imageCompression.getDataUrlFromFile(compressedFile);
    
//     // Get final dimensions
//     const image = await createImageBitmap(compressedFile);
    
//     // Calculate compression ratio
//     const compressionRatio = ((file.size - compressedFile.size) / file.size) * 100;

//     self.postMessage({
//       type: 'done',
//       dataUrl,
//       metadata: {
//         width: image.width,
//         height: image.height,
//         processingTime: Math.round(processingTime),
//         originalSize: file.size,
//         compressedSize: compressedFile.size,
//         compressionRatio: Math.round(compressionRatio),
//       },
//     });
    
//   } catch (error) {
//     console.error('[Worker] Compression failed:', error);
//     self.postMessage({
//       type: 'error',
//       error: error instanceof Error ? error.message : 'Unknown worker error',
//     });
//   }
// };

// // Helper function to create canvas from file
// async function createCanvasFromFile(file: File): Promise<OffscreenCanvas> {
//   const imageBitmap = await createImageBitmap(file);
//   const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
//   const ctx = canvas.getContext('2d')!;
//   ctx.drawImage(imageBitmap, 0, 0);
//   return canvas;
// }
// // // src/workers/image.worker.ts
// // import imageCompression from 'browser-image-compression';
// // import type { ExportOptions } from '../types';

// // // console.log('[Worker] Simple compression worker loaded.');

// // self.onmessage = async (e: MessageEvent) => {
// //   const { file, exportOptions } = e.data as {
// //     file: File;
// //     exportOptions: ExportOptions;
// //   };
// //   // console.log('[Worker] Received job:', { exportOptions });

// //   try {
// //     const startTime = performance.now();

// //     // The library wants quality as a value between 0 and 1
// //     const quality = exportOptions.quality / 100;

// //     const compressionOptions = {
// //       maxSizeMB: 20, // A high limit, we are controlling by quality
// //       useWebWorker: false, // It's already in a worker, so we disable its internal worker
// //       initialQuality: quality,
// //       // The library handles mapping to the correct format string
// //       mimeType: `image/${exportOptions.format}`,
// //     };

// //     // console.log('[Worker] Compressing with options:', compressionOptions);
// //     const compressedFile = await imageCompression(file, compressionOptions);
// //     // console.log('%c[Worker] Compression successful.', 'color: lightgreen');

// //     const processingTime = performance.now() - startTime;
// //     const dataUrl = await imageCompression.getDataUrlFromFile(compressedFile);
    
// //     // To get dimensions, we need to load it as an image
// //     const image = await createImageBitmap(compressedFile);

// //     self.postMessage({
// //       type: 'done',
// //       dataUrl,
// //       metadata: {
// //         width: image.width,
// //         height: image.height,
// //         processingTime: Math.round(processingTime),
// //       },
// //     });
    
// //   } catch (error) {
// //     // console.error('[Worker] Compression failed:', error);
// //     self.postMessage({
// //       type: 'error',
// //       error: error instanceof Error ? error.message : 'Unknown worker error',
// //     });
// //   }
// // };