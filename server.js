import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'dist', req.url)
  
  // Serve index.html for root and SPA routes
  if (req.url === '/' || !path.extname(filePath)) {
    filePath = path.join(__dirname, 'dist', 'index.html')
  }

  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      // Fallback to index.html for SPA routing
      fs.readFile(path.join(__dirname, 'dist', 'index.html'), 'utf8', (fallbackErr, fallbackContent) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' })
          res.end('404 Not Found')
          return
        }
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(fallbackContent)
      })
      return
    }

    const ext = path.extname(filePath)
    let contentType = 'text/plain'
    if (ext === '.html') contentType = 'text/html'
    else if (ext === '.js') contentType = 'application/javascript'
    else if (ext === '.css') contentType = 'text/css'
    else if (ext === '.json') contentType = 'application/json'
    else if (ext === '.svg') contentType = 'image/svg+xml'
    else if (ext === '.png') contentType = 'image/png'
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    else if (ext === '.webp') contentType = 'image/webp'

    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
  })
})

server.listen(port, () => {
  console.log(`Reaxo app running at http://localhost:${port}`)
})
