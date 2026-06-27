<script setup lang="ts">
import AddFileIcon from '@shared/assets/icons/AddFileIcon.svg?component'
import { useChatActions } from "@/features/chat/model/useChatActions";
import {ref} from "vue";

const chatActions = useChatActions();
const fileInputRef = ref<HTMLInputElement | null>(null);

const onFileChange = (event: Event) => {
  chatActions.handleAddFile(event);

  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}
</script>

<template>
  <label for="user-file" class="label-add-file"><AddFileIcon/></label>
  <input
    type="file"
    id="user-file"
    name="document"
    accept=".pdf,.doc,.docx,image/*, .mp3, .wav, .m4a, .mp4, .webm"
    class="visually-hidden"
    @change.prevent="onFileChange"
    multiple
    ref="fileInputRef"
  >
</template>


<style lang="css" scoped>
.label-add-file {
  color: var(--neutral-color);
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
  flex-shrink: 0;
  height: 28px;
  width: 28px;
}

.label-add-file:hover{
  padding: 6px;
  background-color: var(--background-hover);
  border-radius: 50%;
  flex-grow: 0;
  flex-shrink: 0;
}

#user-file {
  width: 50px;
}

</style>