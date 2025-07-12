// src/store/useImageStore.ts
import { create } from 'zustand';
import type { ProcessingMetadata, ExportOptions } from '../../types';
import { processImageConversion } from '../lib/image-processing/imageConverter';

interface ImageState {
  originalFile: File | null;
  originalImageUrl: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  processingProgress: number;
  processingMessage: string;
  error: string | null;
  processingMetadata: ProcessingMetadata | null;
  exportOptions: ExportOptions;
}

interface ImageActions {
  setOriginalFile: (file: File | null) => void;
  setExportOption: (option: keyof ExportOptions, value: string | number) => void;
  convertAndProcess: () => Promise<void>;
  resetProcessing: () => void;
  setProcessingProgress: (progress: number, message?: string) => void;
}

// Better default options for compression
const initialExportOptions: ExportOptions = { 
  format: 'jpeg', 
  quality: 75, // Sweet spot for compression vs quality
  maxDimension: 1920 // Reasonable max dimension
};

const initialState: Omit<ImageState, 'exportOptions'> = {
  originalFile: null,
  originalImageUrl: null,
  processedImage: null,
  isProcessing: false,
  processingProgress: 0,
  processingMessage: '',
  error: null,
  processingMetadata: null,
};

export const useImageStore = create<ImageState & ImageActions>((set, get) => ({
  ...initialState,
  exportOptions: initialExportOptions,
  
  setOriginalFile: (file) => {
    set(state => {
      if (state.originalImageUrl) URL.revokeObjectURL(state.originalImageUrl);
      if (!file) return { ...initialState, exportOptions: initialExportOptions };
      
      // Smart defaults based on file type and size
      const isLarge = file.size > 5 * 1024 * 1024; // 5MB
      const isPng = file.type.includes('png');
      
      const smartDefaults: ExportOptions = {
        format: isPng ? 'png' : 'jpeg',
        quality: isLarge ? 60 : 75, // Lower quality for large files
        maxDimension: isLarge ? 1600 : 1920, // Smaller max dimension for large files
      };
      
      return { 
        ...initialState,
        exportOptions: smartDefaults,
        originalFile: file,
        originalImageUrl: URL.createObjectURL(file),
      };
    });
  },

  setExportOption: (option, value) => {
    set((state) => ({ 
      exportOptions: { ...state.exportOptions, [option]: value },
      // Reset processed image when settings change
      processedImage: null,
      processingMetadata: null,
      error: null
    }));
  },

  resetProcessing: () => {
    set({ 
      processedImage: null, 
      processingMetadata: null, 
      error: null,
      processingProgress: 0,
      processingMessage: ''
    });
  },

  setProcessingProgress: (progress: number, message?: string) => {
    set({ 
      processingProgress: progress,
      processingMessage: message || ''
    });
  },

  convertAndProcess: async () => {
    const { originalFile, exportOptions } = get();
    if (!originalFile) {
      console.error("[Store] Convert called but no original file exists.");
      return;
    }

    console.log(`[Store] Starting compression with options:`, exportOptions);
    set({ 
      isProcessing: true, 
      error: null, 
      processingProgress: 0,
      processingMessage: 'Initializing...'
    });

    try {
      const result = await processImageConversion(originalFile, exportOptions);
      console.log(`[Store] Compression successful. Ratio: ${result.metadata.compressionRatio}%`);
      set({ 
        processedImage: result.dataUrl, 
        processingMetadata: result.metadata,
        processingProgress: 100,
        processingMessage: 'Complete!'
      });
    } catch (error) {
      console.error(`[Store] Compression failed:`, error);
      set({ 
        error: error instanceof Error ? error.message : "An unknown error occurred",
        processingProgress: 0,
        processingMessage: ''
      });
    } finally {
      set({ isProcessing: false });
    }
  },
}));
// // src/store/useImageStore.ts
// import { create } from 'zustand';
// import type { ProcessingMetadata, ExportOptions } from '../../types';
// import { processImageConversion } from '../lib/image-processing/imageConverter';

// interface ImageState {
//   originalFile: File | null;
//   originalImageUrl: string | null;
//   processedImage: string | null;
//   isProcessing: boolean;
//   error: string | null;
//   processingMetadata: ProcessingMetadata | null;
//   exportOptions: ExportOptions;
// }

// interface ImageActions {
//   setOriginalFile: (file: File | null) => void;
//   setExportOption: (option: keyof ExportOptions, value: string | number) => void;
//   convertAndProcess: () => Promise<void>;
//   resetProcessing: () => void;
// }

// // Better default options for compression
// const initialExportOptions: ExportOptions = { 
//   format: 'jpeg', 
//   quality: 75, // Sweet spot for compression vs quality
//   maxDimension: 1920 // Reasonable max dimension
// };

// const initialState: Omit<ImageState, 'exportOptions'> = {
//   originalFile: null,
//   originalImageUrl: null,
//   processedImage: null,
//   isProcessing: false,
//   error: null,
//   processingMetadata: null,
// };

// export const useImageStore = create<ImageState & ImageActions>((set, get) => ({
//   ...initialState,
//   exportOptions: initialExportOptions,
  
//   setOriginalFile: (file) => {
//     set(state => {
//       if (state.originalImageUrl) URL.revokeObjectURL(state.originalImageUrl);
//       if (!file) return { ...initialState, exportOptions: initialExportOptions };
      
//       // Smart defaults based on file type and size
//       const isLarge = file.size > 5 * 1024 * 1024; // 5MB
//       const smartDefaults: ExportOptions = {
//         format: file.type.includes('png') ? 'png' : 'jpeg',
//         quality: isLarge ? 65 : 75, // Lower quality for large files
//         maxDimension: isLarge ? 1600 : 1920, // Smaller max dimension for large files
//       };
      
//       return { 
//         ...initialState,
//         exportOptions: smartDefaults,
//         originalFile: file,
//         originalImageUrl: URL.createObjectURL(file),
//       };
//     });
//   },

//   setExportOption: (option, value) => {
//     set((state) => ({ exportOptions: { ...state.exportOptions, [option]: value } }));
//   },

//   resetProcessing: () => {
//     set({ processedImage: null, processingMetadata: null, error: null });
//   },

//   convertAndProcess: async () => {
//     const { originalFile, exportOptions } = get();
//     if (!originalFile) {
//       console.error("[Store] Convert called but no original file exists.");
//       return;
//     }

//     console.log(`[Store] Starting compression with options:`, exportOptions);
//     set({ isProcessing: true, error: null });

//     try {
//       const result = await processImageConversion(originalFile, exportOptions);
//       console.log(`[Store] Compression successful. Ratio: ${result.metadata.compressionRatio}%`);
//       set({ processedImage: result.dataUrl, processingMetadata: result.metadata });
//     } catch (error) {
//       console.error(`[Store] Compression failed:`, error);
//       set({ error: error instanceof Error ? error.message : "An unknown error occurred" });
//     } finally {
//       set({ isProcessing: false });
//     }
//   },
// }));
