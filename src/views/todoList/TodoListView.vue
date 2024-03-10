<template>
  <a-modal
    :footer="null"
    :open="isModalOpened"
    cancel-text="Закрыть"
    ok-text="Сохранить"
    title="Редактировать задачу"
    @cancel="closeModal"
  >
    <edit-task />
  </a-modal>
  <a-layout class="layout">
    <a-layout-content class="layout--content">
      <a-segmented v-model:value="currentFilter" :options="filters" class="filters" />
      <a-input
        v-model:value="newTaskTitle"
        class="new-task"
        placeholder="Добавить задачу"
        @pressEnter="onAddNewTask"
      />
      <div class="actions">
        <a-button :disabled="!newTaskTitle" :icon="h(AppstoreAddOutlined)" @click="onAddNewTask">
          Добавить задачу
        </a-button>
        <a-button :danger="mode === 'delete'" :icon="h(DeleteOutlined)" @click="toggleMode">
          Режим удаления
        </a-button>
      </div>
      <a-divider />
      <div v-if="tasks.length > 0" class="task-list">
        <div v-for="task in displayedTasks" :key="task.id" class="task">
          <a-typography-link :delete="task.isDone" @click="() => onTaskClick(task.id)">
            {{ task.title }}
          </a-typography-link>
          <div class="task_actions">
            <a-checkbox v-model:checked="task.isDone" />
            <DeleteOutlined
              v-if="mode === 'delet e'"
              @click="() => deleteTask(task.id)"
            ></DeleteOutlined>
          </div>
        </div>
      </div>
      <a-empty v-else description="Список задач пуст"></a-empty>
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
import { computed, h, onMounted, reactive, ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { Task } from '@/types'
import { AppstoreAddOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import EditTask from '@/views/todoList/components/EditTask.vue'
import { StorageKeys, TasksFilters } from '@/views/enums'

type Filter = {
  label: string
  value: TasksFilters
}
const filters = reactive<Filter[]>([
  { label: 'Все', value: TasksFilters.All },
  { label: 'Незавершенные', value: TasksFilters.Unfinished },
  { label: 'Завершенные', value: TasksFilters.Finished }
])
const currentFilter = ref('all')
const tasks = useLocalStorage<Task[]>(StorageKeys.Tasks, [])
const editTaskId = useLocalStorage<string | null>(StorageKeys.EditTaskId, null)

const displayedTasks = computed(() => {
  if (currentFilter.value === TasksFilters.Finished)
    return tasks.value.filter((state) => state.isDone)
  if (currentFilter.value === TasksFilters.Unfinished)
    return tasks.value.filter((state) => !state.isDone)
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
  if (!newTaskTitle.value) return
  const id = 'task-id' + new Date().getTime()
  tasks.value.push({
    id,
    title: newTaskTitle.value,
    isDone: false
  })
  newTaskTitle.value = null
}
const onTaskClick = (taskId: string) => {
  editTaskId.value = taskId
  isModalOpened.value = true
}
const isModalOpened = useLocalStorage(StorageKeys.IsMpdalOpened, false)
const closeModal = () => {
  isModalOpened.value = false
}

watch(isModalOpened, (v) => {
  if (!v) editTaskId.value = null
})
onMounted(() => {
  isModalOpened.value = false
})
</script>

<style scoped>
.layout {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10% 15%;
}

.layout--content {
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.layout--content > * {
  width: 100%;
}

.task {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.task_actions {
  display: flex;
  gap: 5px;
  align-items: center;
}

.actions {
  gap: 10px;
  display: flex;
  justify-content: space-around;
}

.task-list {
  padding: 5px;
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
