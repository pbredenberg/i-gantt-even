<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePeopleStore } from '../stores/people';
import { useTasksStore } from '../stores/tasks';
import type { Person } from '../types/person';

interface Task {
   id: string;
   name: string;
   start: string; // ISO date string
   end: string; // ISO date string
   assigneeId?: string | null;
   comments?: string;
}

const props = defineProps<{ tasks: Task[] }>(),
      selectedTask = ref<Task | null>(null);

const peopleStore = usePeopleStore();
const people = computed(() => peopleStore.people);
const tasksStore = useTasksStore();

function onAssigneeChange(event: Event, taskId: string) {
   const select = event.target as HTMLSelectElement;
   const personId = select.value;
   if (personId) {
      tasksStore.assignTask(taskId, personId);
   } else {
      tasksStore.unassignTask(taskId);
   }
}

function getPersonById(id?: string | null): Person | undefined {
   if (!id) return undefined;
   return people.value.find(p => p.id === id);
}

function getInitials(name: string): string {
   const parts = name.split(' ');
   if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '';
   return (parts[0][0] ?? '').toUpperCase() + (parts[1][0] ?? '').toUpperCase();
}


const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const zoomLevel = ref<'month' | 'quarter' | 'year'>('month');

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function setPeriodOffset(offset: number) {
  if (zoomLevel.value === 'month') {
    const newDate = addMonths(new Date(currentYear.value, currentMonth.value, 1), offset);
    currentMonth.value = newDate.getMonth();
    currentYear.value = newDate.getFullYear();
  } else if (zoomLevel.value === 'quarter') {
    const newDate = addMonths(new Date(currentYear.value, currentMonth.value, 1), offset * 3);
    currentMonth.value = newDate.getMonth();
    currentYear.value = newDate.getFullYear();
  } else if (zoomLevel.value === 'year') {
    currentYear.value += offset;
    currentMonth.value = 0;
  }
}

const periodLabel = computed(() => {
  if (zoomLevel.value === 'month') {
    return new Date(currentYear.value, currentMonth.value).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  } else if (zoomLevel.value === 'quarter') {
    const q = Math.floor(currentMonth.value / 3) + 1;
    return `Q${q} ${currentYear.value}`;
  } else {
    return `${currentYear.value}`;
  }
});

const timeline = computed(() => {
  if (zoomLevel.value === 'month') {
    const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      label: (i + 1).toString(),
      date: new Date(currentYear.value, currentMonth.value, i + 1),
      daysInMonth,
    }));
  } else if (zoomLevel.value === 'quarter') {
    const startMonth = Math.floor(currentMonth.value / 3) * 3;
    return Array.from({ length: 3 }, (_, i) => {
      const monthIdx = startMonth + i;
      const daysInMonth = new Date(currentYear.value, monthIdx + 1, 0).getDate();
      return {
        label: new Date(currentYear.value, monthIdx).toLocaleString('default', { month: 'short' }),
        date: new Date(currentYear.value, monthIdx, 1),
        daysInMonth,
      };
    });
  } else {
    return Array.from({ length: 12 }, (_, i) => {
      const daysInMonth = new Date(currentYear.value, i + 1, 0).getDate();
      return {
        label: new Date(currentYear.value, i).toLocaleString('default', { month: 'short' }),
        date: new Date(currentYear.value, i, 1),
        daysInMonth,
      };
    });
  }
});

function getBarPosition(task: Task) {
  let left = 0,
    width = 0;
  const minWidth = '1.5rem';
  const start = new Date(task.start);
  const end = new Date(task.end);

  if (zoomLevel.value === 'month') {
    const daysInMonth = timeline.value.length;
    const monthStart = new Date(currentYear.value, currentMonth.value, 1);
    const monthEnd = new Date(currentYear.value, currentMonth.value, daysInMonth);
    const barStart = start < monthStart ? monthStart : start;
    const barEnd = end > monthEnd ? monthEnd : end;
    left = ((barStart.getDate() - 1) / daysInMonth) * 100;
    width = ((barEnd.getDate() - barStart.getDate() + 1) / daysInMonth) * 100;
  } else if (zoomLevel.value === 'quarter') {
    const startMonth = Math.floor(currentMonth.value / 3) * 3;
    const quarterStart = new Date(currentYear.value, startMonth, 1);
    const quarterEnd = new Date(currentYear.value, startMonth + 3, 0);
    const barStart = start < quarterStart ? quarterStart : start;
    const barEnd = end > quarterEnd ? quarterEnd : end;
    const totalDays = timeline.value.reduce((sum, m) => sum + m.daysInMonth, 0);
    const daysFromStart = Math.floor(
      (barStart.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24),
    );
    const barDays = Math.floor((barEnd.getTime() - barStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    left = (daysFromStart / totalDays) * 100;
    width = (barDays / totalDays) * 100;
  } else if (zoomLevel.value === 'year') {
    const yearStart = new Date(currentYear.value, 0, 1);
    const yearEnd = new Date(currentYear.value, 12, 0);
    const barStart = start < yearStart ? yearStart : start;
    const barEnd = end > yearEnd ? yearEnd : end;
    const totalDays = timeline.value.reduce((sum, m) => sum + m.daysInMonth, 0);
    const daysFromStart = Math.floor(
      (barStart.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24),
    );
    const barDays = Math.floor((barEnd.getTime() - barStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    left = (daysFromStart / totalDays) * 100;
    width = (barDays / totalDays) * 100;
  }
  return { left: left + '%', width: width + '%', minWidth };
}

const visibleTasks = computed(() => {
  return props.tasks.filter((task) => {
    const start = new Date(task.start);
    const end = new Date(task.end);
    if (zoomLevel.value === 'month') {
      const monthStart = new Date(currentYear.value, currentMonth.value, 1);
      const monthEnd = new Date(currentYear.value, currentMonth.value, timeline.value.length);
      return end >= monthStart && start <= monthEnd;
    } else if (zoomLevel.value === 'quarter') {
      const startMonth = Math.floor(currentMonth.value / 3) * 3;
      const quarterStart = new Date(currentYear.value, startMonth, 1);
      const quarterEnd = new Date(currentYear.value, startMonth + 3, 0);
      return end >= quarterStart && start <= quarterEnd;
    } else {
      const yearStart = new Date(currentYear.value, 0, 1);
      const yearEnd = new Date(currentYear.value, 12, 0);
      return end >= yearStart && start <= yearEnd;
    }
  });
});
import { onMounted, onUnmounted } from 'vue';



// Keyboard shortcut map for navigation and zoom
// Key: shortcut string (e.g., 'ArrowLeft', '+', 'PageUp')
// Value: function to execute
const shortcutMap: Record<string, () => void> = {
  ArrowLeft: () => setPeriodOffset(-1), // Previous period
  ArrowRight: () => setPeriodOffset(1), // Next period
  PageUp: () => setPeriodOffset(-3),    // Jump back (3 periods for quarter/year)
  PageDown: () => setPeriodOffset(3),   // Jump forward
  Home: () => {
    currentMonth.value = 0;
    // Optionally, scroll to start of year
  },
  End: () => {
    currentMonth.value = 11;
    // Optionally, scroll to end of year
  },
  '+': () => {
    if (zoomLevel.value === 'year') zoomLevel.value = 'quarter';
    else if (zoomLevel.value === 'quarter') zoomLevel.value = 'month';
  },
  '-': () => {
    if (zoomLevel.value === 'month') zoomLevel.value = 'quarter';
    else if (zoomLevel.value === 'quarter') zoomLevel.value = 'year';
  },
  '0': () => {
    zoomLevel.value = 'month';
  },
};

function isInputElement(element: Element | null): boolean {
  if (!element) return false;
  const tag = element.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    (element as HTMLElement).isContentEditable
  );
}

function handleKeydown(e: KeyboardEvent) {
  // Do not handle if focus is in an input/textarea/select or editable
  if (isInputElement(document.activeElement)) return;
  const fn = shortcutMap[e.key];
  if (fn) {
    e.preventDefault();
    fn();
  }
}


onMounted(() => {
  // Always listen for keyboard shortcuts globally
  window.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

// --- Drag-and-drop logic for task bars ---
const draggedTaskId = ref<string | null>(null);
const dragStartX = ref<number | null>(null);
const dragInitialStart = ref<Date | null>(null);
const dragInitialEnd = ref<Date | null>(null);
const dragDeltaDays = ref<number>(0);
const dragBarRef = ref<HTMLElement | null>(null);
const wasDragged = ref<boolean>(false); // Track if a drag occurred

function handleBarClick(task: Task) {
   if (!wasDragged.value) {
      selectedTask.value = task;
   }
}


function onBarPointerDown(event: PointerEvent, task: Task) {
   wasDragged.value = false; // Reset on pointer down
   if (event.button !== 0 && event.pointerType !== 'touch') return;
   draggedTaskId.value = task.id;
   dragStartX.value = event.clientX;
   dragInitialStart.value = new Date(task.start);
   dragInitialEnd.value = new Date(task.end);
   dragDeltaDays.value = 0;
   dragBarRef.value = event.target as HTMLElement;
   window.addEventListener('pointermove', onBarPointerMove);
   window.addEventListener('pointerup', onBarPointerUp, { once: true });
   event.preventDefault();
}

function onBarPointerMove(event: PointerEvent) {
   if (!draggedTaskId.value || dragStartX.value == null || !dragInitialStart.value || !dragInitialEnd.value) return;
   const bar = dragBarRef.value;
   if (!bar) return;
   let daysInPeriod = 1;
   let pxPerDay = 1;
   if (zoomLevel.value === 'month') {
      daysInPeriod = timeline.value.length;
      pxPerDay = bar.parentElement?.offsetWidth ? bar.parentElement.offsetWidth / daysInPeriod : 1;
   } else if (zoomLevel.value === 'quarter') {
      daysInPeriod = timeline.value.reduce((sum, m) => sum + m.daysInMonth, 0);
      pxPerDay = bar.parentElement?.offsetWidth ? bar.parentElement.offsetWidth / daysInPeriod : 1;
   } else if (zoomLevel.value === 'year') {
      daysInPeriod = timeline.value.reduce((sum, m) => sum + m.daysInMonth, 0);
      pxPerDay = bar.parentElement?.offsetWidth ? bar.parentElement.offsetWidth / daysInPeriod : 1;
   }
   const dx = event.clientX - dragStartX.value;
   const daysMoved = Math.round(dx / pxPerDay);
   dragDeltaDays.value = daysMoved;
   if (Math.abs(dx) > 3) {
      wasDragged.value = true;
   }
}

function onBarPointerUp() {
   // Always reset wasDragged after pointer up
   setTimeout(() => { wasDragged.value = false }, 0);
   if (!draggedTaskId.value || dragDeltaDays.value === 0 || !dragInitialStart.value || !dragInitialEnd.value) {
      resetDrag();
      return;
   }
   const newStart = new Date(dragInitialStart.value);
   newStart.setDate(newStart.getDate() + dragDeltaDays.value);
   const newEnd = new Date(dragInitialEnd.value);
   newEnd.setDate(newEnd.getDate() + dragDeltaDays.value);
   const task = tasksStore.tasks.find(t => t.id === draggedTaskId.value);
   if (task) {
      task.start = newStart.toISOString().slice(0, 10);
      task.end = newEnd.toISOString().slice(0, 10);
   }
   resetDrag();
}

function resetDrag() {
   draggedTaskId.value = null;
   dragStartX.value = null;
   dragInitialStart.value = null;
   dragInitialEnd.value = null;
   dragDeltaDays.value = 0;
   dragBarRef.value = null;
   window.removeEventListener('pointermove', onBarPointerMove);
}
// --- End drag-and-drop logic ---

// --- Preview bar for drag-and-drop ---
const previewBarPosition = computed(() => {
   if (!draggedTaskId.value || dragDeltaDays.value === 0) return null;
   const task = tasksStore.tasks.find(t => t.id === draggedTaskId.value);
   if (!task) return null;
   const start = new Date(task.start);
   const end = new Date(task.end);
   start.setDate(start.getDate() + dragDeltaDays.value);
   end.setDate(end.getDate() + dragDeltaDays.value);
   return getBarPosition({ ...task, start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) });
});
// --- End preview bar logic ---

</script>

<template>
  <div
    class="overflow-x-auto bg-white rounded-lg shadow p-4"
  >

    <!-- Controls -->
    <div class="flex items-center border-b border-gray-200 mb-0 gap-4">
      <!-- Keyboard Shortcuts Help Icon -->
      <div class="relative group" style="width: 24px; height: 24px;">
        <span
          class="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-center font-bold cursor-pointer"
          tabindex="0"
          aria-label="Show keyboard shortcuts"
        >
          ?
        </span>
        <div
          class="absolute left-8 top-0 z-10 w-64 p-3 bg-white border border-gray-300 rounded shadow-lg text-xs text-gray-800 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto"
          role="tooltip"
        >
          <strong class="block mb-1">Keyboard Shortcuts</strong>
          <ul class="list-disc pl-4">
            <li><kbd>←</kbd>/<kbd>→</kbd>: Move period left/right</li>
            <li><kbd>PageUp</kbd>/<kbd>PageDown</kbd>: Jump 3 periods</li>
            <li><kbd>Home</kbd>/<kbd>End</kbd>: Go to start/end of year</li>
            <li><kbd>-</kbd>: Zoom out (month → quarter → year)</li>
            <li><kbd>+</kbd>: Zoom in (year → quarter → month)</li>
            <li><kbd>0</kbd>: Reset zoom to month</li>
          </ul>
          <span class="block mt-2 text-gray-500">Shortcuts work unless focus is in an input or editable field.</span>
        </div>
      </div>
      <div class="w-48"></div>
      <div class="flex-1 flex items-center justify-center gap-2">
        <button @click="setPeriodOffset(-1)" class="px-2 py-1 rounded hover:bg-gray-100 text-lg">
          &#8592;
        </button>
        <div class="flex-1 text-center text-base font-semibold text-gray-700 py-1">
          {{ periodLabel }}
        </div>
        <button @click="setPeriodOffset(1)" class="px-2 py-1 rounded hover:bg-gray-100 text-lg">
          &#8594;
        </button>
      </div>
      <select v-model="zoomLevel" class="border border-gray-300 rounded px-2 py-1 text-sm">
        <option value="month">Month</option>
        <option value="quarter">Quarter</option>
        <option value="year">Year</option>
      </select>
    </div>
    <!-- Timeline header -->
    <div class="flex border-b border-gray-200 mb-2">
      <div class="w-48"></div>
      <div class="flex-1 flex">
        <template v-if="zoomLevel === 'month'">
          <div
            v-for="d in timeline"
            :key="d.label"
            class="flex-1 text-xs text-center text-gray-500"
          >
            {{ d.label }}
          </div>
        </template>
        <template v-else>
          <div
            v-for="m in timeline"
            :key="m.label"
            class="flex-1 text-xs text-center text-gray-500"
          >
            {{ m.label }}
          </div>
        </template>
      </div>
    </div>
    <!-- Tasks rows -->
    <div v-for="task in visibleTasks" :key="task.id" class="flex items-center mb-2">
      <div class="w-48 pr-2 text-sm font-medium text-gray-700 truncate flex items-center gap-2">
        {{ task.name }}
        <select
          class="ml-2 border border-gray-300 rounded px-1 py-0.5 text-xs bg-white text-gray-700"
          :value="task.assigneeId ?? ''"
          @change="onAssigneeChange($event, task.id)"
          style="min-width: 6em"
        >
          <option value="">Unassigned</option>
          <option v-for="person in people" :key="person.id" :value="person.id">
            {{ person.name }}
          </option>
        </select>
      </div>
      <div class="flex-1 relative h-8">
        <!-- Drag preview bar -->
        <div
          v-if="draggedTaskId === task.id && previewBarPosition"
          class="absolute h-6 rounded gantt-bar-preview"
          :style="previewBarPosition"
          aria-hidden="true"
        ></div>
        <div
          class="absolute h-6 rounded bg-blue-500 flex items-center justify-center text-white text-xs shadow gap-2 pr-2"
          :class="{ 'dragging-bar': draggedTaskId === task.id }"
          :style="getBarPosition(task)"
          @pointerdown="onBarPointerDown($event, task)"
          @click="handleBarClick(task)"
        >
          <template v-if="task.assigneeId">
            <span
              v-if="getPersonById(task.assigneeId)"
              class="flex items-center mr-1"
              :title="getPersonById(task.assigneeId)?.name"
            >
              <span
                class="inline-flex items-center justify-center rounded-full text-xs font-bold mr-1"
                :style="{
                  backgroundColor: getPersonById(task.assigneeId)?.color ?? '#CBD5E1',
                  color: '#fff',
                  width: '1.5em',
                  height: '1.5em',
                  minWidth: '1.5em',
                  minHeight: '1.5em',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }"
              >
                {{ getInitials(getPersonById(task.assigneeId)?.name || '') }}
              </span>
            </span>
          </template>
          {{ new Date(task.start).toLocaleDateString() }} -
          {{ new Date(task.end).toLocaleDateString() }}
        </div>
      </div>
    </div>
    <div v-if="visibleTasks.length === 0" class="text-gray-400 italic mt-4">No tasks yet.</div>
  </div>

  <!-- Task Details Modal -->
  <div v-if="selectedTask" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <button @click="selectedTask = null" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
      <h3 class="text-xl font-bold mb-4">Task Details</h3>
      <div class="mb-3">
        <span class="font-medium">Task Name:</span>
        <span class="ml-2 text-gray-700">{{ selectedTask.name }}</span>
      </div>
      <div class="mb-3 flex items-center gap-2">
        <span class="font-medium">Assignee:</span>
        <template v-if="selectedTask.assigneeId && getPersonById(selectedTask.assigneeId)">
          <span
            class="inline-flex items-center justify-center rounded-full text-xs font-bold mr-1"
            :style="{
              backgroundColor: getPersonById(selectedTask.assigneeId)?.color ?? '#CBD5E1',
              color: '#fff',
              width: '1.5em',
              height: '1.5em',
              minWidth: '1.5em',
              minHeight: '1.5em',
              boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
            }"
          >
            {{ getInitials(getPersonById(selectedTask.assigneeId)?.name || '') }}
          </span>
          <span class="text-gray-700">{{ getPersonById(selectedTask.assigneeId)?.name }}</span>
        </template>
        <template v-else>
          <span class="italic text-gray-400">Unassigned</span>
        </template>
      </div>
      <div class="mb-3 text-sm text-gray-600">
        <span class="font-medium">Start Date:</span>
        <span class="ml-2">{{ new Date(selectedTask.start).toLocaleDateString() }}</span>
      </div>
      <div class="mb-3 text-sm text-gray-600">
        <span class="font-medium">End Date:</span>
        <span class="ml-2">{{ new Date(selectedTask.end).toLocaleDateString() }}</span>
      </div>
      <div class="mb-3 text-sm text-gray-600">
        <span class="font-medium">Task ID:</span>
        <span class="ml-2 font-mono text-xs text-gray-500">{{ selectedTask.id }}</span>
      </div>
      <div class="mb-2">
        <span class="font-medium">Comments:</span>
        <div class="mt-1 p-2 bg-gray-50 rounded border border-gray-200 min-h-[2em] text-gray-700 whitespace-pre-line">
          {{ selectedTask.comments || 'No comments.' }}
        </div>
      </div>
    </div>
  </div>
</template>
