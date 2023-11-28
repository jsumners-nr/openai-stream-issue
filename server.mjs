import http from 'node:http'
import { Readable } from 'node:stream'
import { randomBytes } from 'node:crypto'

let server
process.on('uncaughtException', (error) => {
  console.error('!!! SERVER UNCAUGHT EXCEPTION !!!\n', error)
  server.close()
  process.exit(1)
})

function getStream() {
  return new Readable({
    read(size = 16) {
      const bytes = randomBytes(size)
      const chunk = JSON.stringify({
        id: 'chatcmpl-8MzOfSMbLxEy70lYAolSwdCzfguQZ',
        object: 'chat.completion.chunk',
        // 2023-11-20T09:00:00-05:00
        created: 1700488800,
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            finish_reason: null,
            delta: {role: 'assistant', content: bytes.toString('base64')}
          }
        ]
      })

      this.push('data: ' + chunk + '\n\n')
    }
  }).pause()
}

server = http.createServer((req, res) => {
  const startTime = Date.now()
  const stream = getStream()

  res.statusCode = 200
  stream.on('data', () => {
    const curTime = Date.now()
    if (curTime - startTime >= 5_000) {
      stream.destroy()
      res.destroy()
      server.close()
    }
  })

  stream.pipe(res)
})

server.listen({ host: '127.0.0.1', port: 1666 }, () => {})
