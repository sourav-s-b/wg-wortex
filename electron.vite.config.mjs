import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        build: { rollupOptions: { input: resolve(__dirname, 'src/main/main.js') } }
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        build: { rollupOptions: { input: resolve(__dirname, 'src/preload/preload.js') } }
    },
    renderer: {
        root: resolve(__dirname, 'src/renderer'),
        plugins: [react(), tailwindcss()],
        build: {
            rollupOptions: {
                input: resolve(__dirname, 'src/renderer/index.html') // Add this line explicitly
            }
        }
    },
})