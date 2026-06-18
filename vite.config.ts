import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@app': path.resolve(__dirname, './src/app'),
      entities: path.resolve(__dirname, './src/entities'),
    },
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://openrouter.ai',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
