# Client-Side Image Manipulator

A privacy-focused, browser-based tool for quick and efficient image manipulation. Built with Vite, React, TypeScript, and the power of WebAssembly.

![Screenshot of the tool in action](link/to/screenshot.png) <!-- We will add this later -->

## ✨ Features

*   **Resize:** Change image dimensions with aspect ratio locking.
*   **Format Conversion:** Convert between JPEG, PNG, and WebP.
*   **Quality Adjustment:** Control the compression level for JPEG and WebP.
*   **Basic Filters:** Apply effects like grayscale.
*   **100% Private:** All processing happens directly in your browser. Your images never leave your computer.

## 🚀 Why This Project Exists

This tool was built as a lightweight, fast, and privacy-respecting alternative to online image editors that require you to upload your files. It serves as a practical demonstration of using WebAssembly (via `sharp-wasm`) to bring powerful backend libraries to the client-side.

## 🛠️ Tech Stack

*   **Framework:** [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Core Image Library:** [sharp-wasm](https://github.com/plv/sharp-wasm) (WebAssembly port of `sharp`)
*   **Styling:** Plain CSS / CSS Modules

## 本地开发 (Local Development)

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/fady17/vite-image-manipulator.git
    cd vite-image-manipulator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---
## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
