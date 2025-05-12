import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNodeStore = defineStore('nodes', () => {
  const nodes = ref([])

  const addNode = (node) => {
    nodes.value.push(node)
  }

  return { nodes, addNode }
})