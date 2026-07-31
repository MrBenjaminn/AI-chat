import { currentTypeFile } from '../../lib/file/currentFileType'
import { type Attachments, type FileRaw } from '@/shared'
import { clearPreviewUrl } from '../../lib/file/clearPreviewUrl'

export const fileService = {
  handleAddFile(event: Event, files: Attachments[], filesSource: FileRaw[]) {
    if (event.target instanceof HTMLInputElement) {
      const currentFile = event.target

      if (currentFile.files) {
        for (const file of Array.from(currentFile.files)) {
          const preview = URL.createObjectURL(file)
          const kindType = currentTypeFile(file)

          if (!kindType) continue
          const idFiles = crypto.randomUUID()

          const newItem: Attachments = {
            id: idFiles,
            kind: kindType,
            mimeType: file.type,
            fileName: file.name,
            size: file.size,
            previewUrl: preview,
          }

          const newFileSource = {
            id: idFiles,
            fileRaw: file,
          }

          files.push(newItem)
          filesSource.push(newFileSource)
        }
      }
    }
  },
  deletePreviewFile(id: string, files: Attachments[], filesSource: FileRaw[]) {
    const currentIndexFile = files.findIndex((e) => e.id === id)
    if (currentIndexFile !== -1) {
      clearPreviewUrl(files, currentIndexFile)
      files.splice(currentIndexFile, 1)
    }

    const sourceIndex = filesSource.findIndex((e) => e.id === id)
    if (sourceIndex !== -1) {
      filesSource.splice(currentIndexFile, 1)
    }
  },
}
