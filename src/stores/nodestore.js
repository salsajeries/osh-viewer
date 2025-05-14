import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNodeStore = defineStore('nodes', () => {
  const nodes = ref([])

  const addNode = (node) => {
    if(checkIfNodeExists(node.name) || node.name === undefined) {
      console.log("Node already exists or name is undefined", node)
      return
    }
    nodes.value.push(node)
  }

  const removeNode = (node) => {
    nodes.value = nodes.value.filter(n => n !== node)
  }

  const getNodeByName = (name) => {
    return nodes.value.find(node => node.name === name)
  }

  const checkIfNodeExists = (name) => {
    return nodes.value.some(node => node.name === name)
  }

  return { nodes, addNode }
})