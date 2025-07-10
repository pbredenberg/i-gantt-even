<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md sticky top-0 z-30">
      <div class="container mx-auto flex items-center justify-between py-4 px-6">
        <RouterLink
          to="/"
          class="text-2xl font-bold text-blue-600 tracking-tight hover:text-blue-800 transition-colors"
          >I Gantt Even</RouterLink
        >
        <nav class="space-x-4">
          <!-- Add more links here as needed -->
          <RouterLink to="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >Home</RouterLink
          >
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-4 py-8">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t py-4 mt-8 shadow-inner">
      <div
        class="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 text-sm text-gray-500"
      >
        <span>&copy; {{ new Date().getFullYear() }} I Gantt Even. All rights reserved.</span>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
