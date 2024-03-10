import { TasksFilters } from '@/views/enums'

export type Task = {
  id: string
  isDone: boolean
  title: string
  description?: string
}

export type Filter = {
  label: string
  value: TasksFilters
}
