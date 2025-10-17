<template>
  <div class="task-app">
    <header class="app-header">
      <h1>Hrushi's Todo List</h1>
    </header>

    <div class="task-list-section"> 
      <h2>
        Your Tasks: 
        <span v-if="taskStore.tasks.length > 0" class="task-count">
          ({{ taskStore.tasks.length }})
        </span>
        <button @click="openDialog" class="add-task-button">
          +
        </button>
      </h2>

      <div class="task-container">
        <div 
          v-if="taskStore.missingPriorities.length > 0" 
          class="tooltip-indicator"
          @mouseenter="showTooltip = true"
        >
          <div class="indicator-dot"></div>
          <div v-if="showTooltip" 
               class="tooltip-content"
               @mouseleave="showTooltip = false">
            <div class="tooltip-header">Missing Priorities:</div>
            <div class="tooltip-priorities">
              <span
                v-for="priority in taskStore.missingPriorities"
                :key="priority"
                class="tooltip-priority"
              >
                {{ priority }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="taskStore.sortedTasks.length === 0" class="empty-state">
        <p>No tasks yet. Add tasks above</p>
      </div>
      
      <div v-else class="task-list">
        <div
          v-for="task in taskStore.sortedTasks"
          :key="task.id"
          class="task-item"
        >
          <div class="task-content">
            <div class="task-priority">
              <span class="priority-label">Priority</span>
              <span class="priority-value">{{ task.priority }}</span>
            </div>
            <div class="task-text">{{ task.text }}</div>
            <div class="task-meta">
              Added: {{ formatDate(task.createdAt) }}
            </div>
          </div>
          <button
            @click="handleDeleteTask(task.id)"
            class="delete-button"
            title="Delete Task"
          >
            X
          </button>
        </div>
      </div>
      </div>
    </div>
    <AddTaskDialog
      :is-open="isDialogOpen"
      @close="closeDialog"
      @submit="handleAddTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores/task'
import AddTaskDialog from './AddTaskDialog.vue'

const taskStore = useTaskStore()

const isDialogOpen = ref(false)
const showTooltip = ref(false)

const openDialog = () => {
  isDialogOpen.value = true
}

const closeDialog = () => {
  isDialogOpen.value = false
}

const handleAddTask = (text: string, priority: number) => {
  taskStore.addTask(text, priority)
}

const handleDeleteTask = (id: string) => {
  taskStore.deleteTask(id)
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
.task-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-header {
  text-align: center;
  margin-bottom: 3rem;
}

.app-header h1 {
  font-size: 2.5rem;
  margin: 0;
  color: #2c3e50;
}

.subtitle {
  color: #7f8c8d;
  margin-top: 0.5rem;
  font-size: 1.1rem;
}

.add-task-button {
  background: green;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  color: white;
}

.add-task-button:hover {
  width: 1.6rem;
  height: 1.6rem;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.tooltip-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  background: #dc3545;
  border-radius: 50%;
  cursor: pointer;
  animation: pulse 2s infinite;
}

.tooltip-content {
  position: absolute;
  top: 10px;
  right: 0;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  max-height: 200px;
  overflow-y: auto;
  animation: fadeIn 0.2s ease-out;
}

.tooltip-header {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.tooltip-priorities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tooltip-priority {
  background: #2196f3;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.task-list-section h2 {
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-container {
  background-color: #FFFFFF;
  display: flex;
  gap: 0.5rem;
  height: 500px;
  outline: 2px black solid;
  padding: 1rem;
  overflow-y: auto;
  margin-top: 10px;
  position: relative;
}

.task-count {
  background: #6c757d;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.empty-state {
  width: 100%;
  align-self: center;
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-size: 1.1rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
}

.task-item {
  background: white;
  border: 1px solid #dee2e6;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.2s, border-color 0.2s;
  outline: 2px black 75%;
}

.task-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #adb5bd;
}

.task-content {
  flex: 1;
}

.task-priority {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.priority-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.priority-value {
  background: #17a2b8;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

.task-text {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.task-meta {
  font-size: 0.875rem;
  color: #6c757d;
}

.delete-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  margin-left: 1rem;
}

.delete-button:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }
  
  .task-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .delete-button {
    margin-left: 0;
    align-self: flex-end;
  }
}
</style>