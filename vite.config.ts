import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' agar build bisa disajikan dari subfolder mana pun (staging, GitHub Pages)
export default defineConfig({
  plugins: [react()],
  base: './',
});
