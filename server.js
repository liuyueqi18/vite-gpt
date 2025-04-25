import express from 'express'
import axios from 'axios'

const app = express()
app.use(express.json())

const URL = 'https://spark-api-open.xf-yun.com/v1/chat/completions'

app.post('/api/chat', async (req, res) => {
  const text = req.body.text

  try {
    const response = await axios.post(
      URL,
      {
        model: 'lite',
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
        stream: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ZtjGDmzhcnjKzmJoaEuk:nMARjQGGJHaQgqxHoRnR',
        },
        responseType: 'stream',
      }
    )

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    response.data.pipe(res)
  } catch (err) {
    console.error('请求讯飞失败:', err.message)
    if (err.response) {
      console.error('响应状态:', err.response.status)
      console.error('响应头:', err.response.headers)
      console.error('响应内容:', await streamToString(err.response.data))
    } else {
      console.error('错误详情:', err)
    }
    res.status(500).json({ error: 'Server error' })
  }
})

function streamToString(stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    stream.on('error', (err) => reject(err))
  })
}

app.listen(3000, () => {
  console.log('✅ Node 后端已启动：http://localhost:3000')
})
