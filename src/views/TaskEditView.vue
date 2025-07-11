<script setup lang="ts">
import { RouterLink } from 'vue-router';
import TaskEdit from '../components/TaskEdit.vue';
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Edit Task</h1>
      <RouterLink to="/" class="text-gray-600 hover:text-blue-600">
        Back to Chart
      </RouterLink>
    </div>
    <TaskEdit :task-id="$route.params.id" />
  </div>
</template>
