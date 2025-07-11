import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

export interface Task {
   id: string;
   name: string;
   start: string; // ISO date string
   end: string; // ISO date string
   assigneeId?: string | null; // Person ID or null
   comments?: string;
   /**
    * Progress percent complete (0-100)
    */
   progress: number;
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

  function addTask(task: Omit<Task, 'id' | 'progress'> & { progress?: number }) {
   tasks.value.push({ ...task, id: crypto.randomUUID(), progress: typeof task.progress === 'number' ? task.progress : 0 });
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
   /**
    * Set the progress of a task by id
    * @param string taskId - The id of the task
    * @param number progress - The percent complete (0-100)
    */
   function setTaskProgress(taskId: string, progress: number): void {
      const task = tasks.value.find(t => t.id === taskId);
      if (task) {
         task.progress = Math.max(0, Math.min(100, progress));
      }
   }

   return {
      tasks,
      addTask,
      assignTask,
      unassignTask,
      setTaskProgress
   };
});
