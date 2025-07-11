<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTasksStore, type Task } from '../stores/tasks';

const route = useRoute();
const router = useRouter();
const tasksStore = useTasksStore();

const task = ref<Task | null>(null);
const name = ref('');
const start = ref('');
const end = ref('');

onMounted(() => {
  const taskId = route.params.id as string;
  const taskData = tasksStore.tasks.find(t => t.id === taskId);
  if (taskData) {
    task.value = taskData;
    name.value = taskData.name;
    start.value = taskData.start;
    end.value = taskData.end;
  }
});

const updateTask = () => {
  if (task.value) {
    tasksStore.updateTask({
      ...task.value,
      name: name.value,
      start: start.value,
      end: end.value,
    });
    router.push('/');
  }
};

const cancel = () => {
  router.push('/');
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Edit Task</h1>

    <form @submit.prevent="updateTask" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input
          v-model="name"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          v-model="start"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">End Date</label>
        <input
          v-model="end"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div class="flex justify-end space-x-4">
        <button
          @click="cancel"
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
</template>
