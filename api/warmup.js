export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { message, chatId } = req.body
  if (!message || !chatId) return res.status(400).json({ error: 'message and chatId required' })

  const token = process.env.BOT_TOKEN
  if (!token) return res.status(500).json({ error: 'BOT_TOKEN not set' })

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
  })

  const data = await response.json()
  res.status(response.ok ? 200 : 400).json(data)
}
