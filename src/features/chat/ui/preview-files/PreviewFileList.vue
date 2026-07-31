<script setup lang="ts">
import { ButtonVariant } from '@/shared/ui/button/model/button'
import { Button } from '@/shared'
import { useChatStore } from '@/entities/chat/useChatStore'
import DeleteFile from '@shared/assets/icons/DeleteFile.svg?component'
import { checkType } from '@/shared/lib/file/currentFileType'
import { fileService } from '@/shared/lib/file/fileService'
import {
  type PreviewFilesProps,
  PreviewFilesVariant,
} from '@/features/chat/ui/preview-files/model/preview'
import { computed } from 'vue'

const chatStore = useChatStore()
const props = defineProps<PreviewFilesProps>()

const previewFilesVariant = computed(() => {
  return [`base-preview--${props.variant}`]
})

const previewFilesSize = computed(() => {
  return ['base-preview', `base-preview--${props.size}`]
})

const shortTextPreviewFile = 11
const longTextPreviewFile = 50

const textLimit = computed(() => {
  return props.variant === PreviewFilesVariant.Secondary
    ? longTextPreviewFile
    : shortTextPreviewFile
})

function formattedFileName(file: string) {
  return file.length >= textLimit.value ? file.slice(0, textLimit.value) + '...' : file
}
</script>

<template>
  <div class="preview-files">
    <ul class="files-list">
      <li
        class="files-item"
        v-for="item in props.files"
        :key="item.id"
      >
        <img
          v-if="item.mimeType.startsWith('image/')"
          :src="item.previewUrl"
          alt=""
          class="preview-image"
        />
        <div
          :class="previewFilesSize"
          v-else
        >
          <component
            :is="checkType(item)"
            class="file-icon"
          />
          <span :class="previewFilesVariant">
            {{ formattedFileName(item.fileName) }}
          </span>
        </div>
        <Button
          class="remove-btn"
          :variant="ButtonVariant.Secondary"
          :size="null"
          label="deleteFile"
          @click.prevent="
            fileService.deletePreviewFile(item.id, chatStore.files, chatStore.filesSource)
          "
          v-if="props.variant === PreviewFilesVariant.Primary"
        >
          <DeleteFile />
        </Button>
      </li>
    </ul>
  </div>
</template>

<style lang="css" scoped>
.preview-files {
  width: 100%;
  min-width: 0;
  overflow: hidden;
}

.files-list {
  display: flex;
  column-gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;

  min-width: 0;
  flex-wrap: nowrap;
  width: 100%;
  scroll-behavior: smooth;
  overscroll-behavior-x: contain;
}

.remove-btn {
  position: absolute;
  top: 37%;
  right: 37%;
  background-color: #a8a8af;
  border-radius: 50%;
  display: none;
}

.files-item {
  position: relative;
  flex-shrink: 0;
}

.files-item:hover {
  cursor: pointer;
  & .remove-btn {
    display: flex;
  }
}

.preview-image {
  width: 120px;
  height: 120px;
  border-radius: 15px;
}

.file-icon {
  position: absolute;
  top: 10%;
  left: 10%;
  z-index: 2;
  color: var(--neutral-color);
}

.base-preview {
  display: flex;
  flex-wrap: wrap;
  overflow-wrap: break-word;
  border-radius: 15px;
  background-color: #d9dcdf;
}

.base-preview--primary {
  font-size: 12px;
  color: var(--neutral-color);
  margin-top: auto;
  padding: 12px;
}

.base-preview--secondary {
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  margin-top: auto;
  padding: 12px;
  font-size: 12px;
  color: var(--neutral-color);
}

.base-preview--secondary:hover {
  opacity: 0.6;
}

.base-preview--small {
  height: 120px;
  width: 120px;
}

.base-preview--default {
  height: 115px;
  width: 115px;
}
</style>
