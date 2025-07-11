import { setActivePinia, createPinia } from 'pinia';
import { usePeopleStore } from './people';
import { describe, beforeEach, it, expect } from 'vitest';

describe('usePeopleStore', () => {
   beforeEach(() => {
      setActivePinia(createPinia());
   });

   it('initializes with demo people', () => {
      const store = usePeopleStore();
      expect(store.people.length).toBeGreaterThan(0);
   });

   it('can add a person', () => {
      const store = usePeopleStore();
      store.addPerson({ name: 'Test User', color: '#000' });
      expect(store.people.some(p => p.name === 'Test User')).toBe(true);
   });

   it('can edit a person', () => {
      const store = usePeopleStore();
      const id = store.people[0].id;
      store.editPerson(id, { name: 'Updated Name' });
      expect(store.people[0].name).toBe('Updated Name');
   });

   it('can remove a person', () => {
      const store = usePeopleStore();
      const id = store.people[0].id;
      store.removePerson(id);
      expect(store.people.find(p => p.id === id)).toBeUndefined();
   });
});
