import { finalBase64Url } from '../../lib/file/converToBase64.ts'
import { currentTypeFile } from '../../lib/file/currentFileType.ts'
import { TypeFiles } from '../../type/chats'

export function readFiles(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const result = reader.result
        if (typeof result === 'string') {
          const interResult = result.split(',')[1]

          if (currentTypeFile(file) === TypeFiles.audio) {
            const resultAudio = finalBase64Url(interResult)
            resolve(resultAudio)
          } else {
            const resultAnotherFiles = finalBase64Url(result)
            resolve(resultAnotherFiles)
          }
        } else {
          reject(new Error('Не удалось прочитать файл как строку'))
        }
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
