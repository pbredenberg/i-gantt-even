import { setActivePinia, createPinia } from 'pinia';
import { useTasksStore } from './tasks';
import { describe, beforeEach, it, expect } from 'vitest';

describe('useTasksStore', () => {
   beforeEach(() => {
      setActivePinia(createPinia());
      localStorage.clear();
   });

   it('can add a task', () => {
      const store = useTasksStore();
      store.addTask({ name: 'Task', start: '2025-01-01', end: '2025-01-02' });
      expect(store.tasks.length).toBe(1);
   });

   it('can assign and unassign a task', () => {
      const store = useTasksStore();
      store.addTask({ name: 'Task', start: '2025-01-01', end: '2025-01-02' });
      const id = store.tasks[0].id;
      store.assignTask(id, 'person-1');
      expect(store.tasks[0].assigneeId).toBe('person-1');
      store.unassignTask(id);
      expect(store.tasks[0].assigneeId).toBeNull();
   });
});
