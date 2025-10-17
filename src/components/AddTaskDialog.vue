<template>
  <div v-if="isOpen" class="dialog-backdrop" @click="closeDialog">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h2>Add New Task</h2>
        <button @click="closeDialog" class="close-button" title="Close dialog">
          ✕
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="dialog-form">
        <div class="form-group">
          <label for="task-text">Task Label</label>
          <textarea
            id="task-text"
            v-model="taskText"
            placeholder="Enter your task description..."
            required
            rows="3"
            class="task-textarea"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="task-priority">Task Priority</label>
          <input
            id="task-priority"
            v-model.number="taskPriority"
            type="number"
            min="1"
            placeholder="1"
            required
            class="priority-input"
          />
        </div>
        
        <div v-if="missingPriorities.length > 0" class="missing-priorities-dialog">
          <p class="missing-priorities-label">Quick select missing priorities:</p>
          <div class="priority-badges">
            <button
              v-for="priority in missingPriorities"
              :key="priority"
              type="button"
              class="priority-badge"
              @click="selectPriority(priority)"
            >
              {{ priority }}
            </button>
          </div>
        </div>
        
        <div class="dialog-actions">
          <button type="button" @click="closeDialog" class="cancel-button">
            Cancel
          </button>
          <button type="submit" class="submit-button" :disabled="!taskText.trim()">
            Add Task
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useTaskStore } from '@/stores/task'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', text: string, priority: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const taskStore = useTaskStore()

const taskText = ref('')
const taskPriority = ref<number>(1)

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    taskText.value = ''
    taskPriority.value = taskStore.missingPriorities.length > 0 
      ? taskStore.missingPriorities[0] 
      : Math.max(...taskStore.usedPriorities, 0) + 1
  }
})

const missingPriorities = computed(() => taskStore.missingPriorities)

const handleSubmit = () => {
  if (taskText.value.trim() && taskPriority.value > 0) {
    emit('submit', taskText.value.trim(), taskPriority.value)
    closeDialog()
  }
}

const closeDialog = () => {
  emit('close')
}

const selectPriority = (priority: number) => {
  taskPriority.value = priority
}
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

.dialog-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid #e9ecef;
}

.dialog-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}


.dialog-form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.task-textarea {
  padding: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
}

.task-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.priority-input {
  padding: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.missing-priorities-dialog {
  background: #e3f2fd;
  padding: 1rem;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 12px;
  border: 1px solid #bbdefb;
}

.missing-priorities-label {
  margin: 0 0 0.75rem 0;
  color: #1565c0;
  font-size: 0.9rem;
  font-weight: 500;
}

.priority-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.priority-badge {
  background: #2196f3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-button {
  background: red;
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background: #0056b3;
}

.submit-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .dialog-content {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
  
  .dialog-header {
    padding: 1rem 1.5rem 0.75rem;
  }
  
  .dialog-form {
    padding: 1.5rem;
  }
  
  .dialog-actions {
    flex-direction: column-reverse;
  }
  
  .cancel-button,
  .submit-button {
    width: 100%;
  }
}
</style>
