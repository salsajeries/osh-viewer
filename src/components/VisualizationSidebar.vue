<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import { randomUUID } from 'osh-js/source/core/utils/Utils.js'
import Chart from '@/components/visualizations/Chart.vue'
import { useUIStore } from '@/stores/uistore.ts'
import { checkDSForProp, mineDatasourceObsProps, VisualizationMetadata } from '@/lib/DatasourceUtils'
import Video from '@/components/visualizations/Video.vue'

// Each visualization can be represented by an object with a unique id
const visualizations = ref<VisualizationMetadata[]>([])
// const uiStore = useUIStore()

const chartDS = ref<any>(null)

/*function addVisualization() {
  visualizations.value.push({
    id: 'viz-' + randomUUID()
  })
}*/

function addChart() {

  const { ds, observedProps } = mineDatasourceObsProps()

  /* for (const prop of observedProps) {
     if (prop.definition.includes("air_temperature")) {
       console.log('Air temperature property found:', prop);
       chartDS.value = ds;
       // Add a chart for this property
       visualizations.value.push({
         id: 'chart-' + randomUUID(),
         type: 'chart',
         datastreamId: ds.id,
         observedProperty: prop
       });
       return;
     }
   }*/
  const prop = checkDSForProp('air_temperature', observedProps)
  if (prop) {
    console.log('Air temperature property found:', prop)
    chartDS.value = ds
    // Add a chart for this property
    visualizations.value.push({
      id: 'chart-' + randomUUID(),
      type: 'chart',
      datastreamId: ds.id,
      observedProperty: prop
    })
    return
  }
}

function addVideo() {
  const { ds, observedProps } = mineDatasourceObsProps()
  const prop = checkDSForProp('RasterImage', observedProps)

  if (prop) {
    chartDS.value = ds

    visualizations.value.push({
      id: 'video-' + randomUUID(),
      type: 'video',
      datastreamId: ds.id,
      observedProperty: prop
    })
  }
}
</script>

<template>
  <v-sheet id="viz-sidebar">
    <!--    <button @click="addVisualization">Add Visualization</button>-->
    <v-btn @click="addChart">Add Chart</v-btn>
    <v-btn @click="addVideo">Add Video</v-btn>
    <div class="visualization-list">
      <div
        v-for="viz in visualizations"
        :key="viz.id"
        class="visualization-item"
      >
        <Chart :datastream="chartDS" v-if="viz.type==='chart'"></Chart>
        <Video :datastream="chartDS" v-if="viz.type === 'video'"></Video>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
#viz-sidebar {
  width: 100%
}
</style>

