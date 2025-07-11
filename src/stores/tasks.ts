import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

export interface Task {
  id: string;
  name: string;
  start: string; // ISO date string
  end: string; // ISO date string
  assigneeId?: string | null; // Person ID or null
  comments?: string;
}

const STORAGE_KEY = 'tasks';

function loadTasks(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>(loadTasks());

  function addTask(task: Omit<Task, 'id'>) {
    tasks.value.push({ ...task, id: crypto.randomUUID() });
  }

  function updateTask(task: Task) {
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = task;
    }
  }

  // Persist to localStorage whenever tasks change
  watch(
    tasks,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    },
    { deep: true },
  );

  function assignTask(taskId: string, personId: string): void {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      task.assigneeId = personId;
    }
  }

  function unassignTask(taskId: string): void {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      task.assigneeId = null;
    }
  }

  return {
    tasks,
    addTask,
    updateTask,
    assignTask,
    unassignTask
  };
});
