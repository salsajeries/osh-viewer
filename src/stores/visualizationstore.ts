import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import { OSHVisualization } from '@/lib/OSHConnectDataStructs'

export const useVisualizationStore = defineStore('visualizations', () => {
  const visualizations: Ref<OSHVisualization[]> = ref([])

  const addVisualization = (visualization: OSHVisualization): void => {
    console.log('[VisualizationStore] Adding visualization:', visualization)
    visualizations.value.push(visualization)
  }

  const removeVisualization = (visualization: OSHVisualization): void => {
    visualizations.value = visualizations.value.filter(v => v !== visualization)
  }

  const getVisualizationById = (id: string): OSHVisualization | undefined => {
    return visualizations.value.find(visualization => visualization.id === id)
  }

  const getVisualizationsByType = (type: string): OSHVisualization[] => {
    return visualizations.value.filter(visualization => visualization.type === type)
  }

  return { visualizations, addVisualization, removeVisualization, getVisualizationById, getVisualizationsByType }
})