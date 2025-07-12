// src/components/image-editor/FileUpload.tsx
import { useState, useCallback } from 'react';
import { useImageStore } from '../../store/useImageStore';

export function FileUpload() {
  const setOriginalFile = useImageStore((state) => state.setOriginalFile);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File | null) => {
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      setOriginalFile(file);
    } else {
      alert('Please select a valid image file (JPEG, PNG, WebP, AVIF).');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    e.target.value = '';
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Upload Area */}
      <div
        className={`
          relative w-full p-12 border-4 border-dashed rounded-3xl transition-all duration-300
          flex flex-col items-center justify-center text-center
          ${isDragging 
            ? 'border-green-400 bg-green-500/10 scale-105 shadow-2xl shadow-green-500/20' 
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50"></div>
        
        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Icon */}
          <div className="relative">
            <div className={`
              mx-auto w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300
              ${isDragging 
                ? 'bg-green-500/20 scale-110' 
                : 'bg-gray-700/50 hover:bg-gray-600/50'
              }
            `}>
              <svg 
                className={`w-10 h-10 transition-colors duration-300 ${
                  isDragging ? 'text-green-400' : 'text-gray-400'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
            {isDragging && (
              <div className="absolute inset-0 rounded-2xl bg-green-400/20 animate-pulse"></div>
            )}
          </div>

          {/* Main Text */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">
              {isDragging ? 'Drop your image here' : 'Upload Your Image'}
            </h3>
            <p className="text-gray-400 text-lg">
              {isDragging 
                ? 'Release to start processing' 
                : 'Drag & drop or click to select'
              }
            </p>
          </div>

          {/* Upload Button */}
          <div className="space-y-4">
            <label
              htmlFor="file-upload"
              className={`
                cursor-pointer inline-flex items-center px-8 py-4 border-2 border-transparent 
                text-lg font-semibold rounded-xl shadow-lg transition-all duration-300
                ${isDragging 
                  ? 'bg-green-500 hover:bg-green-600 text-white scale-105' 
                  : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white hover:scale-105'
                }
              `}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Select Image File
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          {/* Supported Formats */}
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              {['JPEG', 'PNG', 'WebP', 'AVIF', 'GIF'].map((format) => (
                <span
                  key={format}
                  className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm font-medium border border-gray-600/50"
                >
                  {format}
                </span>
              ))}
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Private Processing</p>
                  <p className="text-gray-500">Never leaves your device</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Lightning Fast</p>
                  <p className="text-gray-500">Instant processing</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Quality Control</p>
                  <p className="text-gray-500">Perfect optimization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 mt-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="text-sm">
                <p className="text-gray-300 font-medium">100% Privacy Guaranteed</p>
                <p className="text-gray-500 mt-1">
                  All image processing happens directly in your browser. Your images never leave your device and are never uploaded to any server.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}