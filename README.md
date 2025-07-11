# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

## Task Assignments & People Management

This project supports assigning tasks to people and visualizing assignments in the Gantt timeline.

### People Data
- People are managed via the Pinia store in `src/stores/people.ts`.
- Each person has an `id`, `name`, and optional `color`.
- Demo people are loaded by default; you can add, edit, or remove people programmatically or via future UI.

### Assigning Tasks
- Each task can be assigned to a person (by their unique ID).
- Use the Pinia tasks store actions `assignTask(taskId, personId)` and `unassignTask(taskId)` to manage assignments.
- The `assigneeId` field on a task references a person.

### Timeline Display
- Assigned tasks show a colored chip with the person's initials on the Gantt chart bar.
- Hovering over the chip reveals the person's full name.
- Unassigned tasks display without an avatar chip.

See `src/stores/people.ts` and `src/stores/tasks.ts` for store logic and usage examples.

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
