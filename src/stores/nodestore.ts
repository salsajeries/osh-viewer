import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import { OSHNode } from '@/lib/OSHConnectDataStructs'

export const useNodeStore = defineStore('nodes', () => {
  const nodes: Ref<OSHNode[]> = ref([])

  const addNode = (node: OSHNode): void => {
    if (checkIfNodeExists(node.name) || node.name === undefined) {
      console.log("Node already exists or name is undefined", node)
      return
    }
    nodes.value.push(node)
  }

  const removeNode = (node: OSHNode): void => {
    nodes.value = nodes.value.filter(n => n !== node)
  }

  const getNodeByName = (name: string): OSHNode | undefined => {
    return nodes.value.find(node => node.name === name)
  }

  const checkIfNodeExists = (name: string): boolean => {
    return nodes.value.some(node => node.name === name)
  }

  return { nodes, addNode, removeNode, getNodeByName, checkIfNodeExists }
})
