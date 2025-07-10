import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

export interface Task {
  id: string;
  name: string;
  start: string; // ISO date string
  end: string; // ISO date string
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

  // Persist to localStorage whenever tasks change
  watch(
    tasks,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    },
    { deep: true },
  );

  return {
    tasks,
    addTask,
  };
});
