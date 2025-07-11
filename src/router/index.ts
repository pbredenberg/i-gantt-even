import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TaskEditView from '../views/TaskEditView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/tasks/:id/edit',
      name: 'task-edit',
      component: TaskEditView,
      props: true,
    },
  ],
});

export default router;
