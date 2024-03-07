<template>
  <a-layout>
    <a-layout-content>
      <a-segmented v-model:value="currentFilter" :options="filters" />
      <a-input
        v-model:value="newTaskTitle"
        placeholder="добавить задачу"
        @pressEnter="onAddNewTask"
      />
      <a-button :icon="h(DeleteOutlined)" @click="toggleMode">Режим удаления</a-button>
      <div v-for="task in displayedTasks" :key="task.id">
        <a-typography-text>{{ task.title }}</a-typography-text>
        <a-checkbox v-model:checked="task.isDone" />
        <DeleteOutlined
          v-if="mode === 'delete'"
          @click="() => deleteTask(task.id)"
        ></DeleteOutlined>
      </div>
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
import { computed, h, reactive, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { Task } from '@/types'
import { DeleteOutlined } from '@ant-design/icons-vue'

type Filter = {
  label: string
  value: 'all' | 'unfinished' | 'finished'
}
const filters = reactive<Filter[]>([
  { label: 'Все', value: 'all' },
  { label: 'Незавершенные', value: 'unfinished' },
  { label: 'Завершенные', value: 'finished' }
])
const currentFilter = ref('all')
const tasks = useLocalStorage<Task[]>('tasks', [])

const displayedTasks = computed(() => {
  if (currentFilter.value === 'finished') return tasks.value.filter((state) => state.isDone)
  if (currentFilter.value === 'unfinished') return tasks.value.filter((state) => !state.isDone)
  return tasks.value
})

const mode = ref<'view' | 'delete'>('view')
const toggleMode = () => {
  mode.value === 'view' ? (mode.value = 'delete') : (mode.value = 'view')
}
const deleteTask = (id: string) => {
  tasks.value = tasks.value.filter((state) => state.id !== id)
}
const newTaskTitle = ref()
const onAddNewTask = () => {
  // add task to localstorage
  const id = 'task-id' + new Date().getTime()
  tasks.value.push({
    id,
    title: newTaskTitle.value,
    isDone: false
  })
  newTaskTitle.value = null
}
</script>

<style scoped></style>
