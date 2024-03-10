<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core'
import type { Task } from '@/views/types'
import { StorageKeys } from '@/views/enums'
import { computed, onMounted, reactive } from 'vue'

const isModalOpened = useLocalStorage(StorageKeys.IsMpdalOpened, false)

const tasks = useLocalStorage<Task[]>(StorageKeys.Tasks, [])
const currentTaskId = useLocalStorage<string>(StorageKeys.EditTaskId, '')
const currentTaskInfo = computed(() => {
  return tasks.value.find((task) => task.id === currentTaskId.value) as Task
})
const taskInfo = reactive<Pick<Task, 'title' | 'description'>>({
  title: '',
  description: ''
})

onMounted(() => {
  taskInfo.title = currentTaskInfo.value.title
  taskInfo.description = currentTaskInfo.value.description
})
const onSave = () => {
  const index = tasks.value.findIndex((task) => task.id === currentTaskId.value)
  tasks.value.splice(index, 1, {
    id: currentTaskInfo.value.id,
    isDone: currentTaskInfo.value.isDone,
    title: taskInfo.title,
    description: taskInfo.description
  })
  isModalOpened.value = false
}
</script>

<template>
  <div class="edit-task">
    <a-input v-model:value="taskInfo.title" class="new-task" placeholder="Заголовок задачи" />
    <a-textarea v-model:value="taskInfo.description" :rows="7" placeholder="Описание задачи" />
    <div class="edit-task--actions">
      <a-button :disabled="!taskInfo.title" type="primary" @click="onSave">Сохранить </a-button>
    </div>
  </div>
</template>

<style scoped>
.edit-task {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.edit-task--actions {
  align-self: end;
}
</style>
