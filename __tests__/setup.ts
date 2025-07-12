// __tests__/setup.ts
import { vi } from 'vitest';

// Mock browser APIs that aren't available in Node.js test environment
Object.defineProperty(globalThis, 'performance', {
  value: {
    now: vi.fn(() => Date.now())
  },
  writable: true,
  configurable: true
});

Object.defineProperty(globalThis, 'URL', {
  value: {
    createObjectURL: vi.fn(() => 'blob:mock-url'),
    revokeObjectURL: vi.fn(),
  },
  writable: true,
  configurable: true
});

// Mock OffscreenCanvas and related APIs
Object.defineProperty(globalThis, 'OffscreenCanvas', {
  value: vi.fn(() => ({
    getContext: vi.fn(() => ({
      drawImage: vi.fn(),
    })),
    convertToBlob: vi.fn(() => Promise.resolve(new Blob())),
    width: 800,
    height: 600
  })),
  writable: true,
  configurable: true
});

Object.defineProperty(globalThis, 'createImageBitmap', {
  value: vi.fn(() => Promise.resolve({
    width: 800,
    height: 600,
    close: vi.fn()
  })),
  writable: true,
  configurable: true
});

// Mock the image compression library
vi.mock('browser-image-compression', () => ({
  default: vi.fn(() => Promise.resolve(new File(['compressed'], 'test.jpg'))),
  getDataUrlFromFile: vi.fn(() => Promise.resolve('data:image/jpeg;base64,mockdata'))
}));

// Mock Worker constructor
const mockWorker = {
  postMessage: vi.fn(),
  onmessage: null as ((e: MessageEvent) => void) | null,
  onerror: null as ((e: ErrorEvent) => void) | null,
  terminate: vi.fn(),
};

Object.defineProperty(globalThis, 'Worker', {
  value: vi.fn(() => mockWorker),
  writable: true,
  configurable: true
});

// Mock zustand store
vi.mock('zustand', () => ({
  create: vi.fn((fn) => {
    let state = {};
    const setState = (newState: any) => {
      state = typeof newState === 'function' ? newState(state) : { ...state, ...newState };
    };
    const getState = () => state;
    
    // Initialize the store
    const store = fn(setState, getState);
    state = store;
    
    return {
      ...store,
      setState,
      getState
    };
  })
}));

// Export the mockWorker for use in tests
(globalThis as any).mockWorker = mockWorker;