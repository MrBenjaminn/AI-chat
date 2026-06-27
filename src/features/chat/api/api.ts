import { apiInstanceChat } from '@/shared/api/base.ts'
import type {Attachments} from "@/entities/chat";

function currentTypeFileResponse (file?: Attachments) {
  if (!file) return
  const baseData = file?.source.value
  const filesBodyResponse = {
    image: { type: 'image_url', 'image_url': { url: baseData }},
    file: { type: 'file', file: { filename: 'document.pdf', 'file_data': baseData }},
    audio: { type: 'input_audio', 'input_audio': {data: baseData, format: file?.mimeType }},
    video: { type: 'video_url', 'video_url': { url: baseData }}
  }
  return filesBodyResponse[file.kind]
}

export async function responseApi(text: string, files?: Attachments[]): Promise<string> {
  const model = import.meta.env.VITE_OPENROUTER_MODEL
  const typeText = { type: 'text', text: text }
  let messagesContent: any[] = [typeText];


  if (files && files.length > 0) {
    const formattedFiles = files
      .map(currentTypeFileResponse)
      .filter(Boolean);

    messagesContent = [...messagesContent, ...formattedFiles];
  }


  const responseTextBody = {
    model,
    messages: [{ role: 'user', content: text }],
    reasoning: { enabled: true },
  }

  const responseFilesBody =  {
    model,
    messages: [{
      role: 'user',
      content: messagesContent
    }],
  }

  const currentBody = !files ? responseTextBody : responseFilesBody
  const responseJustText = await apiInstanceChat.post('/chat/completions', currentBody)
  const aiResponseText = responseJustText.data?.choices[0]?.message?.content

  if (!aiResponseText) {
    throw new Error('Некорректный ответ от модели')
  }

  return aiResponseText
}
