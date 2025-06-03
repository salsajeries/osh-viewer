import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // Sidebar state (example: left and right sidebars)
  const leftSidebarOpen = ref(true)
  const rightSidebarOpen = ref(false)

  // Focused map (could be an ID or name)
  const focusedMap = ref<string | null>(null)

  // Active window items (array of IDs or names)
  const activeWindows = ref<string[]>([])

  // Main window ID to determine center visualization
  const mainWindowId = ref<string | null>(null)

  // Example actions
  function toggleLeftSidebar() {
    leftSidebarOpen.value = !leftSidebarOpen.value
  }
  function toggleRightSidebar() {
    rightSidebarOpen.value = !rightSidebarOpen.value
  }
  function setFocusedMap(mapId: string | null) {
    focusedMap.value = mapId
  }
  function setActiveWindows(windows: string[]) {
    activeWindows.value = windows
  }
  function setMainWindowId(id: string | null) {
    mainWindowId.value = id
  }

  return {
    leftSidebarOpen,
    rightSidebarOpen,
    focusedMap,
    activeWindows,
    mainWindowId,
    toggleLeftSidebar,
    toggleRightSidebar,
    setFocusedMap,
    setActiveWindows,
    setMainWindowId
  }
})
