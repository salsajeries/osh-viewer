import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('systems', () => {
  const systems = ref([])

  const addSystem = (system) => {
    // Check if the system already exists
    if (checkIfSystemExists(system.id) || system.id === undefined) {
      console.log("system already exists or id is undefined", system)
      return
    }
    console.log("adding system", system)
    systems.value.push(system)
  }

  const removeSystem = (system) => {
    systems.value = systems.value.filter(s => s !== system)
  }

  const getSystemByName = (name) => {
    return systems.value.find(system => system.name === name)
  }

  const checkIfSystemExists = (id) => {
    return systems.value.some(system => system.id === id)
  }

  return { systems, addSystem, removeSystem, getSystemByName, checkIfSystemExists  }
})