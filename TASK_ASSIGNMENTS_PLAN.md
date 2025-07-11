# Plan: Adding Task Assignments to Gantt Chart

## 1. Add a People Store and Data

- **Data Model**: Define a `Person` type (id, name, color/avatar, etc.) in `src/types/person.ts`.
- **Store**: Create a Pinia store in `src/stores/people.ts`:
   - State: array of people
   - Actions: add, edit, remove people
   - Load initial demo data for development
- **Persistence (optional)**: Add load/save logic if using localStorage or a backend

## 2. Support Assigning Tasks to People

- **Task Model Update**: Update task type/interface (likely in `src/types/task.ts`) to include an `assigneeId` (or array for multi-assignment)
- **Store/Actions**: Update the tasks store to support assigning/unassigning people to tasks
   - Actions: `assignTask`, `unassignTask`
- **UI: Assignment Controls**: In the task edit/create UI, add a dropdown or multi-select to pick an assignee from the people store
   - Show the current assignee in task details

## 3. Show Assignments in Timeline

- **Timeline Rendering**: Update the timeline (Gantt) component to display the assignee for each task
   - Show avatar, initials, or color chip on each task bar
   - Tooltip or inline label with person’s name
- **Filtering (optional)**: Allow filtering the timeline by assignee (e.g., show only tasks for a selected person)

## 4. Testing & Documentation

- Write unit tests for the new stores and assignment logic
- Update documentation (README or in-app help) to describe how to assign tasks
