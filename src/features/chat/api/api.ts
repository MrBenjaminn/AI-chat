import { apiInstanceChat } from '@/shared/api/base'
import { type Attachments, type ContextMessages } from '@/shared'
import { type FileRaw, RoleSender } from '@/shared/type/chats'
import type { OpenRouterMessageContent } from '@/features/chat/api/type'
import { toValue } from 'vue'
import { readFiles } from '@/shared/lib/file/readFiles'
import { authService } from '@/shared/lib/auth/tokenService'

async function currentTypeFileResponse(
  file: Attachments,
  fileBase: File,
): Promise<OpenRouterMessageContent | undefined> {
  if (!file || !fileBase) return

  try {
    const currentBase = await readFiles(fileBase)
    if (!currentBase) return

    const filesBodyResponse = {
      image: { type: 'image_url', image_url: { url: currentBase } },
      file: { type: 'file', file: { filename: file.fileName, file_data: currentBase } },
      audio: { type: 'input_audio', input_audio: { data: currentBase, format: file?.mimeType } },
      video: { type: 'video_url', video_url: { url: currentBase } },
    }

    return filesBodyResponse[file.kind]
  } catch (error) {
    console.error('Ошибка при чтении файла:', error)
    return undefined
  }
}

export async function prepareChatBody(
  text: string,
  fileBase: FileRaw[],
  files?: Attachments[],
  messages?: ContextMessages[],
  stream: boolean = false,
) {
  const model = import.meta.env.VITE_OPENROUTER_MODEL || 'stealth/space-bunny-alpha'
  const typeText = { type: 'text', text: text }

  let messagesContent: OpenRouterMessageContent[] = [typeText]

  const sourceMap = new Map()
  fileBase.forEach((item) => sourceMap.set(item.id, item.fileRaw))

  if (files && files.length > 0) {
    const filePromises = files.map((el) => {
      const source = sourceMap.get(el.id)
      if (!source) return
      return currentTypeFileResponse(el, source)
    })

    const resolvedFiles = await Promise.all(filePromises)

    const formattedFiles = resolvedFiles.filter((file): file is OpenRouterMessageContent => !!file)

    messagesContent = [...messagesContent, ...formattedFiles]
  }
  const rawMessages = toValue(messages)

  const responseTextBody = {
    model,
    messages: [...(rawMessages ?? []), { role: RoleSender.user, content: text }],
    reasoning: { enabled: true },
    stream,
  }
  const responseFilesBody = {
    model,
    messages: [
      ...(rawMessages ?? []),
      {
        role: RoleSender.user,
        content: messagesContent,
      },
    ],
    reasoning: { enabled: true },
    stream,
  }

  return (files?.length ?? 0) > 0 ? responseFilesBody : responseTextBody
}

export async function responseApi(
  text: string,
  fileBase: FileRaw[],
  files?: Attachments[],
  messages?: ContextMessages[],
): Promise<string> {
  const body = await prepareChatBody(text, fileBase, files, messages, false)
  const responseJustText = await apiInstanceChat.post('/chat/completions', body)
  const aiResponseText = responseJustText.data?.choices[0]?.message?.content

  if (!aiResponseText) {
    throw new Error('Некорректный ответ от модели')
  }

  return aiResponseText
}

export async function responseApiStream(
  text: string,
  fileBase: FileRaw[],
  files: Attachments[] | undefined,
  messages: ContextMessages[] | undefined,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const body = await prepareChatBody(text, fileBase, files, messages, true)

  const baseUrl = import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
  const openRouterTitle = import.meta.env.VITE_OPENROUTER_APP_TITLE || 'My AI Chat App'
  const referer =
    import.meta.env.VITE_OPENROUTER_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  const userKey = authService.getAuthData()?.userKey

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'HTTP-Referer': referer,
    'X-OpenRouter-Title': openRouterTitle,
  }
  if (userKey) {
    headers['Authorization'] = `Bearer ${userKey}`
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    let errMessage = `Ошибка запроса (${response.status})`
    try {
      const errData = await response.json()
      if (errData?.error?.message) {
        errMessage = errData.error.message
      }
    } catch {
      // ignore
    }
    throw new Error(errMessage)
  }

  if (!response.body) {
    throw new Error('Поток ответа недоступен')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let fullText = ''
  let buffer = ''
  let isReasoning = false

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith(':')) continue

        if (trimmed === 'data: [DONE]') {
          if (isReasoning) {
            const closeTag = '\n</think>\n\n'
            fullText += closeTag
            onChunk(closeTag)
            isReasoning = false
          }
          return fullText
        }

        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6))
            const choice = data?.choices?.[0]
            if (!choice) continue

            const delta = choice.delta
            if (!delta) continue

            // Обработка reasoning токенов
            if (delta.reasoning) {
              if (!isReasoning) {
                isReasoning = true
                const openTag = '<think>\n'
                fullText += openTag
                onChunk(openTag)
              }
              fullText += delta.reasoning
              onChunk(delta.reasoning)
            }

            // Обработка основного контента
            if (delta.content) {
              if (isReasoning) {
                isReasoning = false
                const closeTag = '\n</think>\n\n'
                fullText += closeTag
                onChunk(closeTag)
              }
              fullText += delta.content
              onChunk(delta.content)
            }
          } catch {
            // Пропуск незавершенных или невалидных JSON-строк
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  if (isReasoning) {
    const closeTag = '\n</think>\n\n'
    fullText += closeTag
    onChunk(closeTag)
  }

  if (!fullText) {
    throw new Error('Модель вернула пустой ответ')
  }

  return fullText
}
