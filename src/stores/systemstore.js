import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('systems', () => {
  const systems = ref([])

  const addSystem = (system) => {
    systems.value.push(system)
  }

  const removeSystem = (system) => {
    systems.value = systems.value.filter(s => s !== system)
  }

  const getSystemByName = (name) => {
    return systems.value.find(system => system.name === name)
  }

  return { systems, addSystem, removeSystem, getSystemByName }
})