<script setup lang="ts">
import { ref } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import GanttChart from '@/components/GanttChart.vue';

const importFileInput = ref<HTMLInputElement | null>(null);
function onImportFileChange(event: Event) {
  // Import logic will be implemented in the next step
  // Placeholder for now
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    alert(`Selected file: ${input.files[0].name}\n(Import logic coming soon)`);
    input.value = '';
  }
}

const store = useTasksStore();

const name = ref('');
const start = ref('');
const end = ref('');
const comments = ref('');

// Export menu UI state
const showExportMenu = ref(false);
function selectExportFormat(format: 'json' | 'csv') {
  showExportMenu.value = false;
  const tasks = store.tasks;
  let dataStr = '';
  let mimeType = '';
  let fileExt = '';
  if (format === 'json') {
    dataStr = JSON.stringify(tasks, null, 2);
    mimeType = 'application/json';
    fileExt = 'json';
  } else if (format === 'csv') {
    dataStr = tasksToCSV(tasks);
    mimeType = 'text/csv';
    fileExt = 'csv';
  }
  const now = new Date();
  const dateStr = now.toISOString().slice(0,10).replace(/-/g, '');
  const filename = `tasks-export-${dateStr}.${fileExt}`;
  downloadFile(dataStr, filename, mimeType);
}

function tasksToCSV(tasks: any[]): string {
  if (!tasks.length) return '';
  // Collect all unique keys for headers
  const keys = Array.from(new Set(tasks.flatMap(task => Object.keys(task))));
  const escape = (val: any) => {
    if (val == null) return '';
    const str = String(val);
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };
  const header = keys.join(',');
  const rows = tasks.map(task => keys.map(k => escape(task[k])).join(','));
  return [header, ...rows].join('\n');
}

function downloadFile(data: string, filename: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}


function addTask() {
  if (!name.value || !start.value || !end.value) return;
  store.addTask({ name: name.value, start: start.value, end: end.value, comments: comments.value });
  name.value = '';
  start.value = '';
  end.value = '';
  comments.value = '';
}
</script>

<template>
  <section class="mt-8 flex flex-col md:flex-row gap-8">
    <!-- Task Creator (Left) -->
    <form
      @submit.prevent="addTask"
      class="bg-white rounded-lg shadow p-6 flex flex-col gap-4 w-full md:w-80 md:min-w-64"
    >
      <h2 class="text-xl font-semibold mb-2">Add Task</h2>
      <input
        v-model="name"
        type="text"
        placeholder="Task name"
        class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white w-full"
        required
      />
      <div class="flex flex-col gap-4">
        <div class="flex-1">
          <label class="block text-xs mb-1">Start Date</label>
          <input
            v-model="start"
            type="date"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white w-full"
            required
          />
        </div>
        <div class="flex-1">
          <label class="block text-xs mb-1">End Date</label>
          <input
            v-model="end"
            type="date"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white w-full"
            required
          />
        </div>
      </div>
      <div class="flex-1">
        <label class="block text-xs mb-1">Comments</label>
        <textarea
          v-model="comments"
          placeholder="Optional comments"
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white w-full resize-none"
          rows="2"
        />
      </div>
      <button
        type="submit"
        class="px-4 py-2 rounded font-semibold shadow-sm transition bg-blue-600 text-white hover:bg-blue-700 w-full mt-2"
      >
        Add Task
      </button>
    </form>

    <!-- Export Tasks Toolbar (Right, above Gantt Chart) -->
    <div class="flex-1 min-w-0 flex flex-col">
      <div class="flex justify-end mb-4 gap-2">
        <!-- Import Tasks Button -->
        <label class="relative inline-block">
          <input
            type="file"
            accept=".json,.csv"
            class="hidden"
            @change="onImportFileChange"
            ref="importFileInput"
          />
          <button
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            type="button"
            @click="$refs.importFileInput.click()"
          >
            Import Tasks
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </label>
        <!-- Export Tasks Dropdown -->
        <div class="relative group">
          <button
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            @click="showExportMenu = !showExportMenu"
            @blur="() => setTimeout(() => { showExportMenu = false }, 150)"
            type="button"
          >
            Export Tasks
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-if="showExportMenu" class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
            <button
              class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
              @click="selectExportFormat('json')"
              type="button"
            >
              Export as JSON
            </button>
            <button
              class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
              @click="selectExportFormat('csv')"
              type="button"
            >
              Export as CSV
            </button>
          </div>
        </div>
      </div>
      <GanttChart :tasks="store.tasks" />
    </div>
  </section>
</template>
