import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Person } from '../types/person';

const DEMO_PEOPLE: Person[] = [
   { id: '1', name: 'Alice Johnson', color: '#F87171' },
   { id: '2', name: 'Bob Smith', color: '#60A5FA' },
   { id: '3', name: 'Charlie Lee', color: '#34D399' },
];

export const usePeopleStore = defineStore('people', () => {
   const people = ref<Person[]>([...DEMO_PEOPLE]);

   function addPerson(person: Omit<Person, 'id'>) {
      const id = crypto.randomUUID();
      people.value.push({ ...person, id });
   }

   function editPerson(id: string, updates: Partial<Omit<Person, 'id'>>) {
      const idx = people.value.findIndex(p => p.id === id);
      if (idx !== -1) {
         people.value[idx] = { ...people.value[idx], ...updates };
      }
   }

   function removePerson(id: string) {
      people.value = people.value.filter(p => p.id !== id);
   }

   return { people, addPerson, editPerson, removePerson };
});
