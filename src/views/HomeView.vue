<script setup lang="ts">
import { ref } from 'vue';
import { useTasksStore } from '@/stores/tasks';

const store = useTasksStore();

const name = ref('');
const start = ref('');
const end = ref('');

function addTask() {
  if (!name.value || !start.value || !end.value) return;
  store.addTask({ name: name.value, start: start.value, end: end.value });
  name.value = '';
  start.value = '';
  end.value = '';
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
      <button
        type="submit"
        class="px-4 py-2 rounded font-semibold shadow-sm transition bg-blue-600 text-white hover:bg-blue-700 w-full mt-2"
      >
        Add Task
      </button>
    </form>

    <!-- Timeline (Right) -->
    <div class="flex-1">
      <h2 class="text-xl font-semibold mb-4">Tasks Timeline</h2>
      <ul class="relative border-l-2 border-blue-200 pl-6">
        <li v-for="task in store.tasks" :key="task.id" class="mb-8 last:mb-0">
          <div
            class="absolute -left-3.5 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow"
          >
            <span class="text-xs">{{ new Date(task.start).getDate() }}</span>
          </div>
          <div class="bg-white rounded-lg shadow p-4 ml-2">
            <div class="font-semibold text-blue-700">{{ task.name }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ task.start }} &rarr; {{ task.end }}</div>
          </div>
        </li>
        <li v-if="store.tasks.length === 0" class="text-gray-400 italic">No tasks yet.</li>
      </ul>
    </div>
  </section>
</template>
