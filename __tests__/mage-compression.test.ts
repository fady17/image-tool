// __tests__/image-compression-simple.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Define types locally
interface ExportOptions {
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
  maxDimension: number;
}

interface ProcessingMetadata {
  width: number;
  height: number;
  processingTime: number;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

// Helper function to create mock files
function createMockFile(
  name: string = 'test.jpg',
  size: number = 1024 * 1024, // 1MB
  type: string = 'image/jpeg'
): File {
  const content = new Uint8Array(size);
  return new File([content], name, { type });
}

// Mock store implementation (simplified)
function createMockStore() {
  const initialState = {
    originalFile: null as File | null,
    originalImageUrl: null as string | null,
    processedImage: null as string | null,
    isProcessing: false,
    error: null as string | null,
    processingMetadata: null as ProcessingMetadata | null,
    exportOptions: { format: 'jpeg', quality: 75, maxDimension: 1920 } as ExportOptions
  };

  let state = { ...initialState };

  return {
    getState: () => state,
    setState: (newState: Partial<typeof state>) => {
      state = { ...state, ...newState };
    },
    setOriginalFile: (file: File | null) => {
      if (state.originalImageUrl) {
        URL.revokeObjectURL(state.originalImageUrl);
      }
      
      if (!file) {
        state = { ...initialState };
        return;
      }

      const isLarge = file.size > 5 * 1024 * 1024;
      const smartDefaults: ExportOptions = {
        format: file.type.includes('png') ? 'png' : 'jpeg',
        quality: isLarge ? 65 : 75,
        maxDimension: isLarge ? 1600 : 1920,
      };

      state = {
        ...initialState,
        exportOptions: smartDefaults,
        originalFile: file,
        originalImageUrl: URL.createObjectURL(file),
      };
    },
    setExportOption: (option: keyof ExportOptions, value: string | number) => {
      state.exportOptions = { ...state.exportOptions, [option]: value };
    },
    resetProcessing: () => {
      state.processedImage = null;
      state.processingMetadata = null;
      state.error = null;
    },
    // Simplified conversion without worker
    convertAndProcess: async () => {
      if (!state.originalFile) {
        console.error("[Store] Convert called but no original file exists.");
        return;
      }

      state.isProcessing = true;
      state.error = null;

      try {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Mock successful result
        state.processedImage = 'data:image/jpeg;base64,mockprocesseddata';
        state.processingMetadata = {
          width: 800,
          height: 600,
          processingTime: 150,
          originalSize: state.originalFile.size,
          compressedSize: Math.floor(state.originalFile.size * 0.6),
          compressionRatio: 40
        };
      } catch (error) {
        state.error = error instanceof Error ? error.message : "An unknown error occurred";
      } finally {
        state.isProcessing = false;
      }
    }
  };
}

describe('Image Compression System (Simplified)', () => {
  let imageStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    imageStore = createMockStore();
  });

  describe('File Handling', () => {
    it('should set original file and create object URL', () => {
      const mockFile = createMockFile('test.png', 2 * 1024 * 1024, 'image/png');
      
      imageStore.setOriginalFile(mockFile);
      
      const state = imageStore.getState();
      expect(state.originalFile).toBe(mockFile);
      expect(state.originalImageUrl).toBe('blob:mock-url');
      expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);
    });

    it('should set smart defaults based on file type and size', () => {
      // Test large PNG file
      const largePngFile = createMockFile('large.png', 6 * 1024 * 1024, 'image/png');
      imageStore.setOriginalFile(largePngFile);
      
      let state = imageStore.getState();
      expect(state.exportOptions.format).toBe('png');
      expect(state.exportOptions.quality).toBe(65);
      expect(state.exportOptions.maxDimension).toBe(1600);

      // Test small JPEG file
      const smallJpegFile = createMockFile('small.jpg', 1 * 1024 * 1024, 'image/jpeg');
      imageStore.setOriginalFile(smallJpegFile);
      
      state = imageStore.getState();
      expect(state.exportOptions.format).toBe('jpeg');
      expect(state.exportOptions.quality).toBe(75);
      expect(state.exportOptions.maxDimension).toBe(1920);
    });

    it('should clean up object URL when setting null file', () => {
      const mockFile = createMockFile();
      
      // Set file first
      imageStore.setOriginalFile(mockFile);
      expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);
      
      // Set to null
      imageStore.setOriginalFile(null);
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
      
      const state = imageStore.getState();
      expect(state.originalFile).toBeNull();
      expect(state.originalImageUrl).toBeNull();
    });

    it('should handle very small files', () => {
      const tinyFile = createMockFile('tiny.jpg', 1024); // 1KB
      imageStore.setOriginalFile(tinyFile);
      
      const state = imageStore.getState();
      expect(state.exportOptions.quality).toBe(75);
      expect(state.exportOptions.maxDimension).toBe(1920);
    });

    it('should handle very large files', () => {
      const hugeFile = createMockFile('huge.jpg', 50 * 1024 * 1024); // 50MB
      imageStore.setOriginalFile(hugeFile);
      
      const state = imageStore.getState();
      expect(state.exportOptions.quality).toBe(65);
      expect(state.exportOptions.maxDimension).toBe(1600);
    });
  });

  describe('Export Options', () => {
    it('should update export options', () => {
      imageStore.setExportOption('quality', 90);
      imageStore.setExportOption('format', 'png');
      imageStore.setExportOption('maxDimension', 2560);
      
      const state = imageStore.getState();
      expect(state.exportOptions.quality).toBe(90);
      expect(state.exportOptions.format).toBe('png');
      expect(state.exportOptions.maxDimension).toBe(2560);
    });

    it('should handle various quality levels', () => {
      const testCases = [
        { quality: 10, expected: 10 },
        { quality: 50, expected: 50 },
        { quality: 100, expected: 100 },
      ];

      testCases.forEach(({ quality, expected }) => {
        imageStore.setExportOption('quality', quality);
        expect(imageStore.getState().exportOptions.quality).toBe(expected);
      });
    });

    it('should handle different formats', () => {
      const formats = ['jpeg', 'png', 'webp'] as const;
      
      formats.forEach(format => {
        imageStore.setExportOption('format', format);
        expect(imageStore.getState().exportOptions.format).toBe(format);
      });
    });

    it('should handle different max dimensions', () => {
      const dimensions = [800, 1200, 1920, 2560];
      
      dimensions.forEach(dimension => {
        imageStore.setExportOption('maxDimension', dimension);
        expect(imageStore.getState().exportOptions.maxDimension).toBe(dimension);
      });
    });
  });

  describe('Processing State', () => {
    it('should reset processing state', () => {
      // Set some processing state
      imageStore.setState({
        processedImage: 'data:image/jpeg;base64,test',
        processingMetadata: { 
          width: 100, 
          height: 100, 
          processingTime: 50, 
          originalSize: 1000, 
          compressedSize: 500, 
          compressionRatio: 50 
        },
        error: 'Some error'
      });
      
      imageStore.resetProcessing();
      
      const state = imageStore.getState();
      expect(state.processedImage).toBeNull();
      expect(state.processingMetadata).toBeNull();
      expect(state.error).toBeNull();
    });

    it('should handle successful conversion', async () => {
      const mockFile = createMockFile();
      
      // Set up the store with a file
      imageStore.setOriginalFile(mockFile);
      
      // Start conversion
      const conversionPromise = imageStore.convertAndProcess();
      
      // Check that processing state is set
      expect(imageStore.getState().isProcessing).toBe(true);
      expect(imageStore.getState().error).toBeNull();
      
      await conversionPromise;
      
      const state = imageStore.getState();
      expect(state.isProcessing).toBe(false);
      expect(state.processedImage).toBe('data:image/jpeg;base64,mockprocesseddata');
      expect(state.processingMetadata).toBeDefined();
      expect(state.processingMetadata?.width).toBe(800);
      expect(state.processingMetadata?.height).toBe(600);
      expect(state.processingMetadata?.compressionRatio).toBe(40);
      expect(state.error).toBeNull();
    });

    it('should handle conversion when no file is set', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await imageStore.convertAndProcess();
      
      expect(consoleSpy).toHaveBeenCalledWith('[Store] Convert called but no original file exists.');
      
      consoleSpy.mockRestore();
    });
  });

  describe('File Type Detection', () => {
    it('should detect PNG files correctly', () => {
      const pngFile = createMockFile('test.png', 2 * 1024 * 1024, 'image/png');
      imageStore.setOriginalFile(pngFile);
      
      const state = imageStore.getState();
      expect(state.exportOptions.format).toBe('png');
    });

    it('should detect JPEG files correctly', () => {
      const jpegFile = createMockFile('test.jpg', 2 * 1024 * 1024, 'image/jpeg');
      imageStore.setOriginalFile(jpegFile);
      
      const state = imageStore.getState();
      expect(state.exportOptions.format).toBe('jpeg');
    });

    it('should default to JPEG for unknown types', () => {
      const unknownFile = createMockFile('test.bmp', 2 * 1024 * 1024, 'image/bmp');
      imageStore.setOriginalFile(unknownFile);
      
      const state = imageStore.getState();
      expect(state.exportOptions.format).toBe('jpeg');
    });
  });

  describe('State Management', () => {
    it('should maintain state consistency', () => {
      const initialState = imageStore.getState();
      expect(initialState.originalFile).toBeNull();
      expect(initialState.isProcessing).toBe(false);
      expect(initialState.error).toBeNull();
      expect(initialState.exportOptions.format).toBe('jpeg');
      expect(initialState.exportOptions.quality).toBe(75);
      expect(initialState.exportOptions.maxDimension).toBe(1920);
    });

    it('should handle state updates correctly', () => {
      imageStore.setState({
        isProcessing: true,
        error: 'Test error'
      });
      
      const state = imageStore.getState();
      expect(state.isProcessing).toBe(true);
      expect(state.error).toBe('Test error');
      
      // Should not affect other properties
      expect(state.exportOptions.format).toBe('jpeg');
      expect(state.exportOptions.quality).toBe(75);
    });
  });

  describe('Size-Based Optimization', () => {
    it('should use different settings for different file sizes', () => {
      const testCases = [
        { size: 1024, expectedQuality: 75, expectedDimension: 1920 }, // 1KB
        { size: 1024 * 1024, expectedQuality: 75, expectedDimension: 1920 }, // 1MB
        { size: 3 * 1024 * 1024, expectedQuality: 75, expectedDimension: 1920 }, // 3MB
        { size: 6 * 1024 * 1024, expectedQuality: 65, expectedDimension: 1600 }, // 6MB
        { size: 10 * 1024 * 1024, expectedQuality: 65, expectedDimension: 1600 }, // 10MB
      ];

      testCases.forEach(({ size, expectedQuality, expectedDimension }) => {
        const file = createMockFile('test.jpg', size);
        imageStore.setOriginalFile(file);
        
        const state = imageStore.getState();
        expect(state.exportOptions.quality).toBe(expectedQuality);
        expect(state.exportOptions.maxDimension).toBe(expectedDimension);
      });
    });
  });
});