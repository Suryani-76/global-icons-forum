import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function adminSyncPlugin() {
  return {
    name: 'admin-sync-plugin',
    configureServer(server) {
      server.middlewares.use('/api/sync-admin-to-code', (req, res, next) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              const dataDir = path.resolve(process.cwd(), 'src/data')
              if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true })
              }
              const filePath = path.join(dataDir, 'adminData.json')

              let existing = {}
              if (fs.existsSync(filePath)) {
                try {
                  existing = JSON.parse(fs.readFileSync(filePath, 'utf8'))
                } catch (_) {}
              }

              const merged = { ...existing, ...data }
              fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8')
              console.log('[AdminSync] ✓ Updated src/data/adminData.json with latest admin data')

              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: true, message: 'Admin data saved to codebase' }))
            } catch (err) {
              console.error('[AdminSync] Error saving data:', err)
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
        } else if (req.method === 'GET') {
          const filePath = path.resolve(process.cwd(), 'src/data/adminData.json')
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8')
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(content)
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({}))
          }
        } else {
          next()
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), adminSyncPlugin()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three'],
          'r3f-vendor': ['@react-three/fiber', '@react-three/drei'],
          'motion-vendor': ['framer-motion'],
          'gsap-vendor': ['gsap'],
        },
      },
    },
  },
})
