<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import { randomUUID } from 'osh-js/source/core/utils/Utils.js'
import Chart from '@/components/visualizations/Chart.vue'
import { useUIStore } from '@/stores/uistore.ts'

// Each visualization can be represented by an object with a unique id
const visualizations = ref<{ id: string }[]>([])
const uiStore = useUIStore()

const chartDS = ref<any>(null)

function addVisualization() {
  visualizations.value.push({
    id: 'viz-' + randomUUID()
  })
}

function addChart() {
  // Logic to add a chart visualization
  const ds = uiStore.selectedDatastream;
  if (!ds) {
    console.warn('No datastream selected');
    return;
  }
  console.log('Adding chart for datastream:', ds);
  // Check for air temperature in observedProperties
  const observedProps = ds.datastream.properties?.observedProperties || [];
  console.log('Observed Properties:', observedProps);

  // TODO: make this a method of OSHDatastream...
  for (const prop of observedProps) {
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
  }
}
</script>

<template>
  <v-sheet id="viz-sidebar">
    <button @click="addVisualization">Add Visualization</button>
    <v-btn @click="addChart">Add Chart</v-btn>
    <div class="visualization-list">
      <div
        v-for="viz in visualizations"
        :key="viz.id"
        class="visualization-item"
      >
        <Chart :datastream="chartDS"></Chart>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
#viz-sidebar {
  width: 100%
}
</style>

