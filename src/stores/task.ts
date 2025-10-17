import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TaskItem {
  id: string
  text: string
  priority: number
  createdAt: Date
}

export const useTaskStore = defineStore('todo', () => {
  const tasks = ref<TaskItem[]>([])

  const addTask = (text: string, priority: number) => {
    const newTask: TaskItem = {
      id: Date.now().toString(),
      text,
      priority,
      createdAt: new Date()
    }
    tasks.value.push(newTask)
  }

  const deleteTask = (id: string) => {
    const index = tasks.value.findIndex(todo => todo.id === id)
    if (index > -1) {
      tasks.value.splice(index, 1)
    }
  }

  const sortedTasks = computed(() => {
    return [...tasks.value].sort((a, b) => a.priority - b.priority)
  })

  const usedPriorities = computed(() => {
    return tasks.value.map(task => task.priority).sort((a, b) => a - b)
  })

  const missingPriorities = computed(() => {
    if (usedPriorities.value.length === 0) return []
    
    const min = 1;
    const max = Math.max(...usedPriorities.value)
    const missing: number[] = []
    
    for (let i = min; i <= max; i++) {
      if (!usedPriorities.value.includes(i)) {
        missing.push(i)
      }
    }
    
    return missing
  })

  return {
    tasks,
    sortedTasks,
    usedPriorities,
    missingPriorities,
    addTask,
    deleteTask
  }
})
