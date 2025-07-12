// src/types/index.ts

/**
 * The state of all user-adjustable visual filters.
 */
export interface FilterOptions {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
}

/**
 * The user's desired output format and quality settings.
 */
export interface ExportOptions {
  format: 'png' | 'jpeg' | 'webp' | 'avif';
  quality: number;
  maxDimension?: number; 
}

/**
 * Metadata returned after a successful processing job.
 */
export interface ProcessingMetadata {
  width: number;
  height: number;
  processingTime: number; 
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}