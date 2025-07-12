// src/lib/image-processing/imageConverter.ts
import type { ExportOptions, ProcessingMetadata } from '../../../types';
import { useImageStore } from '../../store/useImageStore';

const worker = new Worker(new URL('../../workers/image.worker.ts', import.meta.url), {
  type: 'module',
});

let currentJob: {
  resolve: (result: { dataUrl: string, metadata: ProcessingMetadata }) => void;
  reject: (error: Error) => void;
} | null = null;

worker.onmessage = (e: MessageEvent) => {
  console.log('[Bridge] Received message from worker:', e.data.type);
  
  if (e.data.type === 'progress') {
    // Update progress in the store
    const { setProcessingProgress } = useImageStore.getState();
    setProcessingProgress(e.data.progress, e.data.message);
    return;
  }
  
  if (!currentJob) return;

  if (e.data.type === 'done') {
    currentJob.resolve(e.data);
  } else if (e.data.type === 'error') {
    currentJob.reject(new Error(e.data.error || 'Unknown worker error'));
  }
  currentJob = null;
};

worker.onerror = (e: ErrorEvent) => {
  console.error('[Bridge] Received FATAL error from worker:', e);
  if (currentJob) {
    currentJob.reject(e.error || new Error('A critical worker error occurred.'));
    currentJob = null;
  }
};

export function processImageConversion(
  file: File,
  exportOptions: ExportOptions
): Promise<{ dataUrl: string, metadata: ProcessingMetadata }> {
  
  return new Promise((resolve, reject) => {
    if (currentJob) {
      console.warn('[Bridge] A new job was requested while another was running. Rejecting new job.');
      return reject(new Error('A process is already running. Please wait.'));
    }

    console.log('[Bridge] Starting new job with options:', exportOptions);
    currentJob = { resolve, reject };
    
    worker.postMessage({ file, exportOptions });
  });
}
// // src/lib/image-processing/imageConverter.ts
// import type { ExportOptions, ProcessingMetadata } from '../../../types';

// // console.log('[Bridge] Initializing bridge and worker...');

// const worker = new Worker(new URL('../../workers/image.worker.ts', import.meta.url), {
//   type: 'module',
// });

// let currentJob: {
//   resolve: (result: { dataUrl: string, metadata: ProcessingMetadata }) => void;
//   reject: (error: Error) => void;
// } | null = null;

// worker.onmessage = (e: MessageEvent) => {
//   // console.log('[Bridge] Received message from worker:', e.data.type);
//   if (!currentJob) return;

//   if (e.data.type === 'done') {
//     currentJob.resolve(e.data);
//   } else {
//     currentJob.reject(new Error(e.data.error || 'Unknown worker error'));
//   }
//   currentJob = null;
// };

// worker.onerror = (e: ErrorEvent) => {
//   // console.error('[Bridge] Received FATAL error from worker:', e);
//   if (currentJob) {
//     currentJob.reject(e.error || new Error('A critical worker error occurred.'));
//     currentJob = null;
//   }
// };

// export function processImageConversion(
//   file: File,
//   exportOptions: ExportOptions
// ): Promise<{ dataUrl: string, metadata: ProcessingMetadata }> {
  
//   return new Promise((resolve, reject) => {
//     if (currentJob) {
//       // console.warn('[Bridge] A new job was requested while another was running. Rejecting new job.');
//       return reject(new Error('A process is already running. Please wait.'));
//     }

//     // console.log('[Bridge] Starting new job. Storing resolve/reject functions.');
//     currentJob = { resolve, reject };
    
//     // console.log('[Bridge] Posting message to worker.');
//     worker.postMessage({ file, exportOptions });
//   });
// }