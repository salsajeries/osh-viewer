<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import { randomUUID } from 'osh-js/source/core/utils/Utils.js'
import Chart from '@/components/visualizations/Chart.vue'
import { useUIStore } from '@/stores/uistore.ts'
import { checkDSForProp, mineDatasourceObsProps, VisualizationMetadata } from '@/lib/DatasourceUtils'
import Video from '@/components/visualizations/Video.vue'
import AddChartModal from '@/components/AddChartModal.vue'
import { useVisualizationStore } from '@/stores/visualizationstore'
import { OSHVisualization } from '@/lib/OSHConnectDataStructs'
import VisualizationWizard from './menus/VisualizationWizard.vue'
import { storeToRefs } from 'pinia'

// Each visualization can be represented by an object with a unique id
// const visualizations = ref<VisualizationMetadata[]>([])
const visualizationStore = useVisualizationStore()
const { visualizations } = storeToRefs(visualizationStore)
const dataSource = ref<any>(null)
const dsProps = ref<any[]>([])
const wizardDialog = ref(false)

/**
 *
 */
function addChart() {

  const { ds, observedProps } = mineDatasourceObsProps()
  dsProps.value = observedProps
  const prop = checkDSForProp('air_temperature', observedProps)

  if (prop) {
    console.log('Air temperature property found:', prop)
    dataSource.value = ds
    return
  }
}

/**
 * Adds a video visualization to the list of visualizations.
 * It checks if the datasource has a 'RasterImage' property and adds it if found.
 */
function addVideo() {
  const { ds, observedProps } = mineDatasourceObsProps()
  dsProps.value = observedProps
  const prop = checkDSForProp('RasterImage', observedProps)

  if (prop) {
    dataSource.value = ds

    const newViz = new OSHVisualization(
      'video-' + randomUUID(),
      'video',
      'video',
      prop.definition,
      ds
    )

    console.log('[Viz-Sidebar] Adding new video visualization:', newViz)

    visualizationStore.addVisualization(newViz)
  }
}


</script>

<template>
  <v-sheet id="viz-sidebar">
    <v-btn @click="wizardDialog = true" class="mb-2">Add Visualization</v-btn>
    <v-dialog v-model="wizardDialog" max-width="540">
      <VisualizationWizard />
    </v-dialog>

    <AddChartModal :onAddChart="addChart" :observedProps="dsProps.values" :dsName="'test'"></AddChartModal>
    <v-btn @click="addVideo">Add Video</v-btn>
    <div class="visualization-list">
      <div
        v-for="viz in visualizations"
        :key="viz.id"
        class="visualization-item"
      >
        <Chart :visualization="viz" v-if="viz.type==='chart'" :datasource="viz.visualizationComponents.dataSource"
               :curve-layer="viz.visualizationComponents.dataLayer"
               :chart-view="viz.visualizationComponents.dataView"></Chart>
        <Video :visualization="viz" v-if="viz.type === 'video'"></Video>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
#viz-sidebar {
  width: 100%
}
</style>
