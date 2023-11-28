import OpenAI from 'openai'

process.on('uncaughtException', (error) => {
  console.error('!!! CLIENT UNCAUGHT EXCEPTION !!!\n', error)
  process.exit(1)
})

const openai = new OpenAI({
  baseURL: 'http://127.0.0.1:1666/v1',
  apiKey: 'super-secret'
})

const response = await openai.chat.completions.create({
  messages: [{ role: 'user', content: 'foo' }],
  // stream: true
})

try {
  let count = 0
  for await (const chunk of response.stream()) {
    console.log('got chunk:', count)
    count += 1
  }
} catch (error) {
  console.error('got expected error:', error)
}
