# TODO: Keyboard Shortcuts for Timeline Navigation and Zooming

- [x] Add keyboard shortcuts for timeline navigation (left/right, jump to start/end, page left/right)
- [x] Add keyboard shortcuts for zooming (in, out, reset)
- [x] Ensure shortcuts do not interfere with text input or accessibility
- [ ] Make shortcuts discoverable (e.g., help section or tooltip)
- [x] Add global keyboard event listeners to `src/components/GanttChart.vue` (shortcuts work unless focus is in input/textarea/select/contenteditable)
- [x] Define mapping of keys to navigation/zoom actions in `GanttChart.vue`
- [x] Implement handler functions that call `setPeriodOffset` and update `zoomLevel` in `GanttChart.vue`
- [x] Prevent shortcut handling when input fields are focused
- [x] Add a help tooltip or section listing shortcuts in `GanttChart.vue`
- [~~] Create `src/components/__tests__/GanttChartShortcuts.test.ts` for unit tests of keyboard shortcut handling (intentionally skipped)
- [x] (Optional) Edit `src/views/HomeView.vue` if integration is needed
- [ ] Update documentation if appropriate
- [x] Review code for performance and maintainability
