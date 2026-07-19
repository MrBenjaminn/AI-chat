import { currentTypeFile } from '../../lib/file/currentFileType'
import { readFiles } from '../../lib/file/readFiles'
import { TypeFormatFiles, type Attachments } from '../../type/chats'
import { clearPreviewUrl } from '../../lib/file/clearPreviewUrl'

export const fileService = {
  async handleAddFile(event: Event, files: Attachments[]) {
    if (event.target instanceof HTMLInputElement) {
      const currentFile = event.target

      if (currentFile.files) {
        for (const file of Array.from(currentFile.files)) {
          const preview = URL.createObjectURL(file)
          const kindType = currentTypeFile(file)
          const currentBase = await readFiles(file)

          if (!kindType) return

          const newItem: Attachments = {
            id: crypto.randomUUID(),
            kind: kindType,
            mimeType: file.type,
            fileName: file.name,
            size: file.size,
            source: {
              type: TypeFormatFiles.base,
              value: currentBase,
            },
            previewUrl: preview,
          }

          files.push(newItem)
        }
      }
    }
  },
  deletePreviewFile(id: string, files: Attachments[]) {
    const currentIndexFile = files.findIndex((e) => e.id === id)
    if (currentIndexFile === -1) return
    files.splice(currentIndexFile, 1)
    clearPreviewUrl(files, currentIndexFile)
  },
}
