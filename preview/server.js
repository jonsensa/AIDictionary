const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 4173
const PROJECT_ROOT = path.resolve(__dirname, '..')
const clients = new Set()
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
}

function sendFile(response, requestedPath) {
  const filePath = path.resolve(PROJECT_ROOT, `.${requestedPath}`)

  if (!filePath.startsWith(PROJECT_ROOT)) {
    response.writeHead(403).end('Forbidden')
    return
  }

  fs.readFile(filePath, (error, contents) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not found')
      return
    }

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream',
    })
    response.end(contents)
  })
}

const server = http.createServer((request, response) => {
  if (request.url === '/events') {
    response.writeHead(200, {
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
    })
    response.write('data: connected\n\n')
    clients.add(response)
    request.on('close', () => clients.delete(response))
    return
  }

  sendFile(response, request.url === '/' ? '/preview/index.html' : request.url)
})

for (const relativePath of ['content.css', 'preview', 'vendor']) {
  fs.watch(path.join(PROJECT_ROOT, relativePath), { recursive: true }, () => {
    for (const client of clients) client.write('data: reload\n\n')
  })
}

server.listen(PORT, () => {
  console.log(`UI playground: http://localhost:${PORT}`)
})
