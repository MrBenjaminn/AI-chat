<script setup lang="ts">
import { ButtonVariant } from '@/shared/ui/button/model/button'
import { Button } from '@/shared'
import { useChatStore } from '@/entities/chat/useChatStore'
import DeleteFile from '@shared/assets/icons/DeleteFile.svg?component'
import { checkType } from '@/shared/lib/file/currentFileType'

const chatStore = useChatStore()
</script>

<template>
  <div class="preview-files">
    <ul class="files-list">
      <li
        class="files-item"
        v-for="item in chatStore.files"
        :key="item.id"
      >
        <img
          v-if="item.mimeType.startsWith('image/')"
          :src="item.previewUrl"
          alt=""
          class="preview-image"
        />
        <div
          class="background-preview"
          v-else
        >
          <component
            :is="checkType(item)"
            class="file-icon"
          />
        </div>
        <Button
          class="remove-btn"
          :variant="ButtonVariant.Secondary"
          :size="null"
          label="deleteFile"
          @click.prevent="chatStore.deletePreviewFile(item.id)"
        >
          <DeleteFile />
        </Button>
        <span class="file-name">
          {{ item.fileName.length >= 10 ? item.fileName.slice(0, 10) + '...' : item.fileName }}
        </span>
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
  background-color: var(--background-hover);
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
  width: 100px;
  height: 120px;
  border-radius: 15px;
}

.background-preview {
  width: 100px;
  height: 120px;
  border-radius: 15px;
  background-color: #515155;
}

.file-icon {
  position: absolute;
  top: 10%;
  left: 10%;
  z-index: 2;
  color: var(--background-hover);
}

.file-name {
  font-size: 12px;
  padding-left: 2px;
  color: var(--neutral-color);
}
</style>
