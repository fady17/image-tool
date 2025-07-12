// src/App.tsx
import { FileUpload } from './components/image-editor/FileUpload';
import { ImageCanvas } from './components/image-editor/ImageCanvas';
import { ControlPanel } from './components/image-editor/ControlPanel';
import { useImageStore } from './store/useImageStore';

function App() {
  const originalFile = useImageStore((state) => state.originalFile);
  const setOriginalFile = useImageStore((state) => state.setOriginalFile);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-green-400 to-teal-500 p-3 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
            Image Compressor
          </h1>

            <span className="font-semibold text-green-400"> 100% client-side processing.</span>
         
          
          {/* Feature badges */}
          {/* <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
              No Upload Required
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
              Multiple Formats
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30">
              Quality Control
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium border border-orange-500/30">
              Batch Processing
            </span>
          </div> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {originalFile ? (
          <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-300">File loaded</span>
                </div>
                <div className="text-sm text-gray-400">
                  {originalFile.name} ({(originalFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              </div>
              <button
                onClick={() => setOriginalFile(null)}
                className="px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Image</span>
              </button>
            </div>

            {/* Editor Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
              <div className="lg:col-span-8 xl:col-span-9">
                <ImageCanvas />
              </div>
              <div className="lg:col-span-4 xl:col-span-3">
                <ControlPanel />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="w-full max-w-4xl">
              <FileUpload />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-700/50">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500">
            Built by{' '}
            <a
              href="https://fadymohamed.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-400 hover:text-green-400 underline underline-offset-2 transition-colors"
            >
              Fady Mohamed
            </a>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>No tracking • No uploads • Open source</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Privacy-first</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;