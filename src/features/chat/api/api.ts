import { apiInstanceChat } from '@/shared/api/base'
import  { type Attachments, type ContextMessages } from '@/shared'
import { RoleSender } from '@/shared/type/chats'
import type { OpenRouterMessageContent } from '@/features/chat/api/type'
import { toValue } from "vue";

function currentTypeFileResponse(file?: Attachments): OpenRouterMessageContent | undefined {
  if (!file) return
  const baseData = file?.source?.value
  if (!baseData) return

  const filesBodyResponse = {
    image: { type: 'image_url', image_url: { url: baseData } },
    file: { type: 'file', file: { filename: 'document.pdf', file_data: baseData } },
    audio: { type: 'input_audio', input_audio: { data: baseData, format: file?.mimeType } },
    video: { type: 'video_url', video_url: { url: baseData } },
  }

  return filesBodyResponse[file.kind]
}

export async function responseApi(text: string, files?: Attachments[], messages?: ContextMessages[] ): Promise<string> {
  const model = import.meta.env.VITE_OPENROUTER_MODEL
  const typeText = { type: 'text', text: text }
  console.log(messages)

  let messagesContent: OpenRouterMessageContent[] = [typeText]

  if (files && files.length > 0) {
    const formattedFiles = files
      .map(currentTypeFileResponse)
      .filter((file): file is OpenRouterMessageContent => !!file)

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

  const currentBody = (files?.length ?? 0) > 0 ? responseFilesBody : responseTextBody
  const responseJustText = await apiInstanceChat.post('/chat/completions', currentBody)
  const aiResponseText = responseJustText.data?.choices[0]?.message?.content

  if (!aiResponseText) {
    throw new Error('Некорректный ответ от модели')
  }

  return aiResponseText
}
