<script setup lang="ts">
import { ref } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import GanttChart from '@/components/GanttChart.vue';

const store = useTasksStore();

const name = ref('');
const start = ref('');
const end = ref('');
const comments = ref('');

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

    <!-- Gantt Chart (Right) -->
    <div class="flex-1 min-w-0">
      <GanttChart :tasks="store.tasks" />
    </div>
  </section>
</template>
