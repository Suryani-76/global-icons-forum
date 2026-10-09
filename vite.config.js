import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function mergeArraySafely(existingArr, incomingArr, idKey = 'id') {
  if (!Array.isArray(existingArr) || existingArr.length === 0) return incomingArr || []
  if (!Array.isArray(incomingArr) || incomingArr.length === 0) return existingArr

  const incomingMap = new Map()
  incomingArr.forEach(item => {
    if (item && item[idKey]) incomingMap.set(item[idKey], item)
  })

  const updatedExisting = existingArr.map(item => {
    if (item && item[idKey] && incomingMap.has(item[idKey])) {
      const incomingItem = incomingMap.get(item[idKey])
      incomingMap.delete(item[idKey])
      return incomingItem
    }
    return item
  })

  const newItems = Array.from(incomingMap.values())
  return [...updatedExisting, ...newItems]
}

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

              const merged = { ...existing }
              for (const [key, val] of Object.entries(data)) {
                if (Array.isArray(existing[key]) && Array.isArray(val)) {
                  merged[key] = mergeArraySafely(existing[key], val)
                } else if (typeof existing[key] === 'object' && existing[key] !== null && typeof val === 'object' && val !== null) {
                  merged[key] = { ...existing[key], ...val }
                } else {
                  merged[key] = val
                }
              }

              fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8')
              console.log('[AdminSync] ✓ Safely merged src/data/adminData.json without losing baseline items')

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
  server: {
    port: 5174,
    strictPort: true,
    watch: {
      ignored: ['**/src/data/**'],
    },
  },
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
