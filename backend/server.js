const http = require('node:http')

const PORT = 3000
const MAX_REQUEST_SIZE = 100_000

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })
  response.end(JSON.stringify(data))
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk

      if (body.length > MAX_REQUEST_SIZE) {
        reject(new Error('Request is too large.'))
        request.destroy()
      }
    })

    request.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('Request body must be valid JSON.'))
      }
    })

    request.on('error', reject)
  })
}

function validateRequest(data) {
  if (typeof data.selectedText !== 'string' || data.selectedText.trim() === '') {
    return 'selectedText must be a non-empty string.'
  }

  if (data.action !== 'summarize' && data.action !== 'question') {
    return 'action must be either summarize or question.'
  }

  if (
    data.action === 'question' &&
    (typeof data.question !== 'string' || data.question.trim() === '')
  ) {
    return 'question must be provided for the question action.'
  }

  return null
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Origin': '*',
    })
    response.end()
    return
  }

  if (request.method !== 'POST' || request.url !== '/api/explain') {
    sendJson(response, 404, { error: 'Route not found.' })
    return
  }

  try {
    const data = await readJsonBody(request)
    const validationError = validateRequest(data)

    if (validationError) {
      sendJson(response, 400, { error: validationError })
      return
    }

    const answer =
      data.action === 'summarize'
        ? `Placeholder summary received for ${data.selectedText.length} characters.`
        : `Placeholder answer received for: ${data.question.trim()}`

    sendJson(response, 200, { answer })
  } catch (error) {
    sendJson(response, 400, { error: error.message })
  }
})

server.listen(PORT, () => {
  console.log(`Context Explainer backend listening on http://localhost:${PORT}`)
})
