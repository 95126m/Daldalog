import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react' // ✅ Emotion JSX 설정 유지
    })
  ],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: 'node_modules', replacement: '/node_modules' }
    ]
  },
  optimizeDeps: {
    include: ['firebase']
  }
})
