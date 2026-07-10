import { finalBase64Url } from '@/shared/lib/file/converToBase64.ts'
import { currentTypeFile } from '@/shared/lib/file/currentFileType.ts'
import { TypeFiles } from '@/entities/chat/types.ts'

export function readFiles(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result as string
      const interResult = result.split(',')[1]
      const resultAudio = finalBase64Url(interResult)
      const resultAnotherFiles = finalBase64Url(result)

      if (currentTypeFile(file) === TypeFiles.audio) {
        resolve(resultAudio)
      } else {
        resolve(resultAnotherFiles)
      }
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
