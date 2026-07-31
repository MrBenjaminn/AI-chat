import { apiInstanceChat } from '@/shared/api/base'
import { type Attachments, type ContextMessages } from '@/shared'
import { type FileRaw, RoleSender } from '@/shared/type/chats'
import type { OpenRouterMessageContent } from '@/features/chat/api/type'
import { toValue } from 'vue'
import { readFiles } from '@/shared/lib/file/readFiles'

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
) {
  const model = import.meta.env.VITE_OPENROUTER_MODEL
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
  }

  return (files?.length ?? 0) > 0 ? responseFilesBody : responseTextBody
}

export async function responseApi(
  text: string,
  fileBase: FileRaw[],
  files?: Attachments[],
  messages?: ContextMessages[],
): Promise<string> {
  const body = await prepareChatBody(text, fileBase, files, messages)
  const responseJustText = await apiInstanceChat.post('/chat/completions', body)
  const aiResponseText = responseJustText.data?.choices[0]?.message?.content

  if (!aiResponseText) {
    throw new Error('Некорректный ответ от модели')
  }

  return aiResponseText
}
