<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import { randomUUID } from 'osh-js/source/core/utils/Utils.js'
import Chart from '@/components/visualizations/Chart.vue'

// Each visualization can be represented by an object with a unique id
const visualizations = ref<{ id: string }[]>([])

function addVisualization() {
  visualizations.value.push({
    id: 'viz-' + randomUUID()
  })
}

function addChart() {
  // Logic to add a chart visualization
  console.log('Add Chart button clicked')
  visualizations.value.push({
    id: 'chart-' + randomUUID()
  })
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
        <Chart></Chart>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
#viz-sidebar {
  width: 100%
}
</style>

