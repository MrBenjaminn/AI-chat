import { apiInstanceChat } from '@/shared/api/base.ts'

export async function responseApi(text: string): Promise<string> {
  const model = import.meta.env.VITE_OPENROUTER_MODEL

  const response = await apiInstanceChat.post('/chat/completions', {
    model,
    messages: [{ role: 'user', content: text }],
    reasoning: { enabled: true },
  })

  const aiResponseText = response.data?.choices[0]?.message?.content

  if (!aiResponseText) {
    throw new Error('Некорректный ответ от модели')
  }

  return aiResponseText
}
